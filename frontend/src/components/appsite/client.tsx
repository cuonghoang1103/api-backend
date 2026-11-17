'use client';

/** Phần chạy ở trình duyệt của bộ trang chủ app: thanh mục con, mã QR, linh vật Gấu, dải ảnh cuộn. */
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { usePathname } from 'next/navigation';
import { QRCodeSVG } from 'qrcode.react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { EmoGau } from '@/components/chat/claude/GauPixel';
import s from './appsite.module.css';

/** Gấu pixel vẽ bằng canvas — tải sau, không chặn HTML đầu. */
const GauBip = dynamic(() => import('@/components/language/mascot/GauBip'), {
  ssr: false,
  loading: () => <span className={s.gauCho} aria-hidden />,
});

export function LinhVat({ cam = 'happy', size = 160, nhan }: { cam?: EmoGau; size?: number; nhan?: string }) {
  return (
    <span className={s.linhVat} style={{ width: size, height: size }}>
      <GauBip emotion={cam} size={size} nhinTheoTro ariaLabel={nhan ?? 'Gấu pixel'} />
    </span>
  );
}

export function ThanhMuc({ goc, muc }: { goc: string; muc: { href: string; nhan: string }[] }) {
  const p = usePathname() ?? '';
  const ref = useRef<HTMLDivElement>(null);
  // Mục đang mở luôn nằm trong tầm nhìn khi thanh cuộn ngang trên điện thoại.
  useEffect(() => {
    ref.current?.querySelector('[aria-current="page"]')?.scrollIntoView({ block: 'nearest', inline: 'center' });
  }, [p]);
  return (
    <div ref={ref} className={s.thanhMuc} role="navigation" aria-label="Mục trang app">
      {muc.map((m) => {
        const dangMo = m.href === goc ? p === goc : p === m.href || p.startsWith(`${m.href}/`);
        return (
          <Link key={m.href} href={m.href} className={s.mucCon} aria-current={dangMo ? 'page' : undefined}>
            {m.nhan}
          </Link>
        );
      })}
    </div>
  );
}

export function MaQr({ url, mau }: { url: string; mau: string }) {
  return (
    <span className={s.qr} title="Quét bằng camera iPhone để mở App Store">
      <QRCodeSVG value={url} size={104} level="M" fgColor="#1b1d24" bgColor="#ffffff" marginSize={1} />
      <small style={{ color: mau }}>Quét để tải</small>
    </span>
  );
}

/** Dải ảnh màn hình cuộn ngang (snap) + hai nút trước/sau. */
export function DaiAnh({ anh, ipad = false }: { anh: { anh: string; nhan: string }[]; ipad?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const [dau, setDau] = useState(true);
  const [cuoi, setCuoi] = useState(false);
  const capNhat = () => {
    const el = ref.current;
    if (!el) return;
    setDau(el.scrollLeft < 8);
    setCuoi(el.scrollLeft + el.clientWidth > el.scrollWidth - 8);
  };
  useEffect(capNhat, []);
  const cuon = (huong: 1 | -1) => ref.current?.scrollBy({ left: huong * ref.current.clientWidth * 0.8, behavior: 'smooth' });
  return (
    <div className={s.daiAnhKhung}>
      <div ref={ref} className={`${s.daiAnh} ${ipad ? s.daiAnhIpad : ''}`} onScroll={capNhat}>
        {anh.map((a) => (
          <figure key={a.anh} className={ipad ? s.mayIpad : s.mayIphone}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={a.anh} alt={a.nhan} loading="lazy" decoding="async" />
            <figcaption>{a.nhan}</figcaption>
          </figure>
        ))}
      </div>
      <button type="button" className={`${s.nutCuon} ${s.nutTrai}`} onClick={() => cuon(-1)} disabled={dau} aria-label="Ảnh trước">
        <ChevronLeft size={18} />
      </button>
      <button type="button" className={`${s.nutCuon} ${s.nutPhai}`} onClick={() => cuon(1)} disabled={cuoi} aria-label="Ảnh sau">
        <ChevronRight size={18} />
      </button>
    </div>
  );
}
