/** Khối dựng dùng chung (chạy ở máy chủ) của bộ trang chủ app. */
import Link from 'next/link';
import type { CSSProperties, ReactNode } from 'react';
import { ArrowRight, Star } from 'lucide-react';
import AppStoreBadge from '@/components/brand/AppStoreBadge';
import type { AppSite } from './types';
import { layThongTinStore, type ThongTinStore } from './store';
import { MaQr, ThanhMuc } from './client';
import PixelDeco from './PixelDeco';
import s from './appsite.module.css';

export const mucCua = (site: AppSite) => [
  { href: site.goc, nhan: 'Trang chủ' },
  { href: `${site.goc}/tinh-nang`, nhan: 'Tính năng' },
  { href: `${site.goc}/huong-dan`, nhan: 'Hướng dẫn' },
  ...(site.pro ? [{ href: `${site.goc}/pro`, nhan: site.pro.ten }] : []),
  { href: `${site.goc}/cong-dong`, nhan: 'Cộng đồng' },
  { href: `${site.goc}/cap-nhat`, nhan: 'Cập nhật' },
  { href: `${site.goc}/tro-giup`, nhan: 'Trợ giúp' },
  { href: `${site.goc}/gioi-thieu`, nhan: 'Giới thiệu' },
];

export const bienMau = (site: AppSite) => ({ '--a': site.mau, '--a2': site.mau2 }) as CSSProperties;

/** Khung chung: dải đầu (icon + tên + nút tải nhỏ) + thanh mục con + nội dung + chân trang. */
export async function KhungApp({ site, children }: { site: AppSite; children: ReactNode }) {
  const st = await layThongTinStore(site.appStoreId);
  return (
    <div className={s.root} style={bienMau(site)}>
      <div className={s.nenLuoi} aria-hidden />
      <header className={s.dau}>
        <div className={s.dauTrong}>
          <Link href={site.goc} className={s.thuongHieu}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={site.icon} alt="" width={36} height={36} className={s.iconNho} />
            <span>
              <b>{site.ten}</b>
              <small>{site.phuDe}</small>
            </span>
          </Link>
          {st.coTren && st.url ? (
            <a href={st.url} target="_blank" rel="noopener noreferrer" className={s.nutTaiNho}>
              Tải app
            </a>
          ) : (
            <span className={s.nhanSapCo}>Sắp có trên App Store</span>
          )}
        </div>
        <ThanhMuc goc={site.goc} muc={mucCua(site)} />
      </header>
      <main className={s.than}>{children}</main>
      <ChanTrang site={site} st={st} />
    </div>
  );
}

/** Huy hiệu App Store + QR + nút phụ. `st.coTren` = false ⇒ "Sắp có", không dựng link chết. */
export function KhoiTai({ site, st, lon = false }: { site: AppSite; st: ThongTinStore; lon?: boolean }) {
  return (
    <div className={s.khoiTai}>
      <div className={s.khoiTaiNut}>
        {st.coTren && st.url ? (
          <AppStoreBadge href={st.url} lang="vi" appName={site.ten} height={lon ? 54 : 44} />
        ) : (
          <span className={s.sapCo}>
            <PixelDeco hinh="sao" o={3} mau="var(--a)" /> Sắp có trên App Store — đang chờ Apple duyệt
          </span>
        )}
        {site.nutPhu.map((n) =>
          n.ngoai ? (
            <a key={n.href} href={n.href} target="_blank" rel="noopener noreferrer" className={s.nutPhu}>
              {n.nhan}
            </a>
          ) : (
            <Link key={n.href} href={n.href} className={s.nutPhu}>
              {n.nhan}
            </Link>
          ),
        )}
      </div>
      {st.coTren && st.url && lon && <MaQr url={st.url} mau={site.mau} />}
      <p className={s.dongStore}>
        {site.nenTang}
        {st.phienBan && <> · phiên bản {st.phienBan}</>}
        {st.dungLuong && <> · {st.dungLuong}</>}
        {st.iosToiThieu && <> · iOS {st.iosToiThieu}+</>}
        {st.danhGia !== undefined && (st.soDanhGia ?? 0) > 0 && (
          <span className={s.sao}>
            {' '}· <Star size={12} fill="currentColor" aria-hidden /> {st.danhGia.toFixed(1)} ({st.soDanhGia} đánh giá)
          </span>
        )}
      </p>
    </div>
  );
}

export function TieuDeMuc({ nhan, tieuDe, moTa, giua = false }: { nhan?: string; tieuDe: string; moTa?: string; giua?: boolean }) {
  return (
    <div className={`${s.tieuDeMuc} ${giua ? s.giua : ''}`}>
      {nhan && <span className={s.nhanMuc}>{nhan}</span>}
      <h2>{tieuDe}</h2>
      {moTa && <p>{moTa}</p>}
    </div>
  );
}

export function NutXem({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link href={href} className={s.nutXem}>
      {children} <ArrowRight size={15} aria-hidden />
    </Link>
  );
}

/** Ảnh một màn trong khung máy (iPhone dọc / iPad). */
export function AnhMay({ anh, nhan, ipad = false }: { anh: string; nhan: string; ipad?: boolean }) {
  return (
    <figure className={ipad ? s.mayIpad : s.mayIphone}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={anh} alt={nhan} loading="lazy" decoding="async" />
    </figure>
  );
}

function ChanTrang({ site, st }: { site: AppSite; st: ThongTinStore }) {
  return (
    <footer className={s.chan}>
      <div className={s.chanTrong}>
        <div className={s.chanCot}>
          <div className={s.thuongHieu}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={site.icon} alt="" width={36} height={36} className={s.iconNho} />
            <span>
              <b>{site.ten}</b>
              <small>{site.phuDe}</small>
            </span>
          </div>
          <KhoiTai site={site} st={st} />
        </div>
        <div className={s.chanCot}>
          <h3>Ứng dụng</h3>
          {mucCua(site).slice(1).map((m) => (
            <Link key={m.href} href={m.href}>{m.nhan}</Link>
          ))}
        </div>
        <div className={s.chanCot}>
          <h3>Chính sách</h3>
          {site.chinhSach.map((c) => (
            <Link key={c.href} href={c.href}>{c.nhan}</Link>
          ))}
        </div>
        <div className={s.chanCot}>
          <h3>Liên hệ</h3>
          <a href={`mailto:${site.lienHe.email}`}>{site.lienHe.email}</a>
          {site.lienHe.kenh.map((k) =>
            k.ngoai ? (
              <a key={k.href} href={k.href} target="_blank" rel="noopener noreferrer">{k.nhan}</a>
            ) : (
              <Link key={k.href} href={k.href}>{k.nhan}</Link>
            ),
          )}
        </div>
      </div>
      <p className={s.banQuyen}>
        © {new Date().getFullYear()} {site.ten} · CuongThai · Apple, logo Apple và App Store là nhãn hiệu của Apple Inc.
      </p>
    </footer>
  );
}
