'use client';

/**
 * Bộ chọn VAI trên thanh tiêu đề dự án (chế độ đóng vai, 27/11/2026) — chỉ hiện khi dự án bật `settings.soloRoles`.
 * Một tài khoản đóng 5 vai C1–C5: vai nhớ theo dự án (lib/work-vai.ts), đi kèm mọi yêu cầu qua header `X-CTW-Vai`.
 * Phím tắt Alt+1…5 đổi vai, Alt+0 bỏ vai. Lệnh ghi trái vai ⇒ máy chủ nhắc (`X-CTW-Vai-Nhac`) ⇒ toast nhẹ có nút đổi vai.
 * Luật tách quyền (notAssignee, tác giả không tự duyệt) so theo vai — xem src/services/work/vaiDong.ts.
 */

import { useEffect, useRef, useSyncExternalStore } from 'react';
import { toast } from 'sonner';
import { Check, UserRound } from 'lucide-react';
import type { ProjectConfig } from '@/lib/work-api';
import { danhDauSolo, datVai, layVai, ngheVai, nhanVai, VAI, VAI_MAU, type NhacVai, type Vai } from '@/lib/work-vai';
import { wt } from '@/components/work/i18n';
import { Popover, useToggle } from './ui';

const MENU_ITEM = 'flex w-full items-center gap-2.5 rounded-[6px] px-2 text-left text-[13px] text-[var(--w-text-2)] hover:bg-[var(--w-hover)] hover:text-[var(--w-text)]';

export function soloRolesOn(config: Pick<ProjectConfig, 'settings'>): boolean {
  return (config.settings?.soloRoles as { enabled?: unknown } | null | undefined)?.enabled === true;
}

/** Vai đang đóng của dự án (đăng ký theo dõi — đổi ở tab này là mọi chỗ vẽ lại). */
export function useVai(pid: number): Vai | null {
  return useSyncExternalStore(ngheVai, () => layVai(pid), () => null);
}

const tenVai = (v: Vai) => `${nhanVai(v)} — ${wt(`vai.r_${v}`)}`;

function doiVai(pid: number, v: Vai | null) {
  datVai(pid, v);
  toast.success(v ? wt('vai.switched', { role: nhanVai(v) }) : wt('vai.cleared'), { id: 'ctw-vai' });
}

export function VaiChip({ vai, className }: { vai: Vai; className?: string }) {
  const c = VAI_MAU[vai];
  return (
    <span
      className={`inline-flex shrink-0 items-center rounded-full px-1.5 text-[11px] font-semibold leading-[18px] ${className ?? ''}`}
      style={{ color: c, background: `color-mix(in srgb, ${c} 14%, transparent)`, border: `1px solid color-mix(in srgb, ${c} 40%, transparent)` }}
      title={wt('vai.acting', { role: tenVai(vai) })}
    >
      {nhanVai(vai)}
    </span>
  );
}

export default function VaiPicker({ config }: { config: ProjectConfig }) {
  const on = soloRolesOn(config);
  const pid = config.id;
  const vai = useVai(pid);
  const pop = useToggle();
  const ref = useRef<HTMLButtonElement>(null);

  // Đánh dấu dự án bật chế độ ⇒ interceptor mới gắn header cho dự án này.
  useEffect(() => {
    danhDauSolo(pid, on);
    return () => danhDauSolo(pid, false);
  }, [pid, on]);

  // Alt+1…5 đổi vai, Alt+0 bỏ vai (dùng e.code: trên macOS Alt+số sinh ký tự khác).
  useEffect(() => {
    if (!on) return;
    const onKey = (e: KeyboardEvent) => {
      if (!e.altKey || e.ctrlKey || e.metaKey) return;
      const m = /^Digit([0-5])$/.exec(e.code);
      if (!m) return;
      e.preventDefault();
      const n = Number(m[1]);
      doiVai(pid, n === 0 ? null : VAI[n - 1]);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [pid, on]);

  // Nhắc nhẹ khi thao tác trái vai (không chặn).
  useEffect(() => {
    if (!on) return;
    const onNhac = (e: Event) => {
      const d = (e as CustomEvent<NhacVai>).detail;
      if (!d || d.pid !== pid) return;
      const dich = d.dung[0];
      toast.info(wt('vai.nudge', { vai: nhanVai(d.vai), dung: d.dung.map(nhanVai).join(' / ') }), {
        id: `ctw-vai-nhac-${dich}`,
        action: { label: wt('vai.switchTo', { role: nhanVai(dich) }), onClick: () => doiVai(pid, dich) },
      });
    };
    window.addEventListener('ctw-vai-nhac', onNhac);
    return () => window.removeEventListener('ctw-vai-nhac', onNhac);
  }, [pid, on]);

  if (!on) return null;
  const c = vai ? VAI_MAU[vai] : 'var(--w-text-3)';
  return (
    <>
      <button
        ref={ref}
        type="button"
        onClick={pop.toggle}
        aria-haspopup="menu"
        aria-expanded={pop.on}
        aria-label={vai ? wt('vai.acting', { role: tenVai(vai) }) : wt('vai.pick')}
        title={`${vai ? wt('vai.acting', { role: tenVai(vai) }) : wt('vai.pick')} · Alt+1…5`}
        className="w-btn w-btn-sm shrink-0 gap-1.5"
        style={{ borderColor: `color-mix(in srgb, ${c} 55%, transparent)`, background: vai ? `color-mix(in srgb, ${c} 12%, transparent)` : undefined }}
        data-testid="vai-picker"
      >
        <UserRound size={13} style={{ color: c }} />
        <span className="whitespace-nowrap text-[12.5px]" style={{ color: vai ? c : undefined }}>
          {vai ? wt('vai.acting', { role: nhanVai(vai) }) : wt('vai.pick')}
        </span>
      </button>
      <Popover open={pop.on} onClose={pop.close} anchorRef={ref} width={300} align="end">
        <div role="menu" aria-label={wt('vai.label')} className="p-1">
          {VAI.map((v, i) => (
            <button key={v} role="menuitemradio" aria-checked={vai === v} type="button" className={`${MENU_ITEM} py-1.5`} onClick={() => { pop.close(); doiVai(pid, v); }}>
              <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: VAI_MAU[v] }} />
              <span className="min-w-0 flex-1">
                <span className="block font-medium text-[var(--w-text)]">{nhanVai(v)} · {wt(`vai.r_${v}`)}</span>
                <span className="block text-[11.5px] text-[var(--w-text-3)]">{wt(`vai.d_${v}`)}</span>
              </span>
              {vai === v ? <Check size={14} /> : <kbd className="w-kbd">{wt('vai.shortcut', { n: i + 1 })}</kbd>}
            </button>
          ))}
          <button role="menuitemradio" aria-checked={!vai} type="button" className={`${MENU_ITEM} py-1.5`} onClick={() => { pop.close(); doiVai(pid, null); }}>
            <span className="h-2.5 w-2.5 shrink-0 rounded-full border border-[var(--w-border-strong)]" />
            <span className="min-w-0 flex-1">
              <span className="block font-medium text-[var(--w-text)]">{wt('vai.none')}</span>
              <span className="block text-[11.5px] text-[var(--w-text-3)]">{wt('vai.noneHint')}</span>
            </span>
            {!vai ? <Check size={14} /> : <kbd className="w-kbd">{wt('vai.shortcut', { n: 0 })}</kbd>}
          </button>
          <p className="border-t border-[var(--w-border)] px-2 pb-1 pt-2 text-[11.5px] leading-snug text-[var(--w-text-3)]">{wt('vai.honest')} {wt('vai.separation')}</p>
        </div>
      </Popover>
    </>
  );
}
