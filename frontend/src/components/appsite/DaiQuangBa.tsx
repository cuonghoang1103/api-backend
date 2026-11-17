/**
 * Dải "Tải app" nhúng vào trang khác của web (/language, /download/ct-work…) — người học trên web thấy app
 * và tải được ngay. Huy hiệu App Store chỉ hiện khi app ĐÃ có trên store (hỏi iTunes, đệm 1 giờ).
 */
import Link from 'next/link';
import AppStoreBadge from '@/components/brand/AppStoreBadge';
import type { AppSite } from './types';
import { layThongTinStore } from './store';
import { bienMau } from './ui';
import s from './appsite.module.css';

export default async function DaiQuangBa({ site, loiMoi }: { site: AppSite; loiMoi?: string }) {
  const st = await layThongTinStore(site.appStoreId);
  return (
    <aside className={`${s.daiQuangBa} ${s.oPixel}`} style={{ ...bienMau(site), ['--k' as string]: 'color-mix(in srgb, var(--text-primary) 82%, transparent)', ['--px' as string]: '3px' }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={site.icon} alt="" width={56} height={56} className={s.iconLon} />
      <div className={s.daiQuangBaChu}>
        <b>App {site.ten} {st.coTren ? 'cho iPhone & iPad' : '— sắp có trên App Store'}</b>
        <span>{loiMoi ?? site.moTa}</span>
      </div>
      <div className={s.daiQuangBaNut}>
        {st.coTren && st.url && <AppStoreBadge href={st.url} lang="vi" appName={site.ten} height={42} />}
        <Link href={site.goc} className={s.lk}>Xem trang app →</Link>
      </div>
    </aside>
  );
}
