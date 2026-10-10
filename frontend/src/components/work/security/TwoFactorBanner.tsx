'use client';

/**
 * CTW đợt 7c (C17): băng nhắc mảnh trên đầu vùng nội dung CT Work khi có không gian ép 2FA mà tài khoản này chưa đạt —
 * đang ân hạn (vàng, đếm ngày) hoặc đã bị chặn (đỏ). Bấm ⇒ /work/security?next=<trang hiện tại>. Ẩn trên chính trang đó.
 * Nhẹ: một lượt GET /me/security mỗi 5 phút (staleTime) — không gọi gì khi không gian nào cũng không ép.
 */

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { ShieldAlert } from 'lucide-react';
import { c7cKeys, securityApi } from '@/lib/work-c7c-api';
import { useWT } from '../i18n';

export default function TwoFactorBanner() {
  const { t, fmtDate } = useWT();
  const pathname = usePathname() ?? '';
  const q = useQuery({ queryKey: c7cKeys.mySecurity, queryFn: securityApi.mine, staleTime: 300_000, retry: false });
  if (pathname.startsWith('/work/security') || !q.data) return null;
  const pending = q.data.workspaces.filter((w) => w.state !== 'OK');
  if (!pending.length) return null;
  const blocked = pending.filter((w) => w.state === 'SETUP_REQUIRED' || w.state === 'VERIFY_REQUIRED');
  const first = blocked[0] ?? pending[0];
  const soonest = pending.filter((w) => w.state === 'GRACE' && w.graceUntil).sort((a, b) => a.graceUntil!.localeCompare(b.graceUntil!))[0];
  const text = blocked.length
    ? (first.state === 'VERIFY_REQUIRED' ? t('c7c.bannerVerify', { ws: first.name }) : t('c7c.bannerBlocked', { ws: first.name }))
    : t('c7c.bannerGrace', { ws: first.name, d: fmtDate(soonest?.graceUntil ?? null) });
  return (
    <div
      role="status"
      data-testid="c7c-2fa-banner"
      className={`flex shrink-0 items-center gap-2 border-b px-3 py-1.5 text-[12.5px] ${blocked.length
        ? 'border-[color-mix(in_srgb,var(--w-red)_40%,transparent)] bg-[color-mix(in_srgb,var(--w-red)_10%,transparent)] text-[var(--w-red-text)]'
        : 'border-[color-mix(in_srgb,var(--w-yellow)_45%,transparent)] bg-[color-mix(in_srgb,var(--w-yellow)_12%,transparent)] text-[var(--w-yellow-text)]'}`}
    >
      <ShieldAlert size={14} className="shrink-0" />
      <span className="min-w-0 flex-1 truncate">{text}</span>
      <Link href={`/work/security?next=${encodeURIComponent(pathname)}`} className="shrink-0 font-medium underline">{t('c7c.bannerAction')}</Link>
    </div>
  );
}
