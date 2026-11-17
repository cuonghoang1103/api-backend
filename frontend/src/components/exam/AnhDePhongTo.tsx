'use client';

/**
 * Ảnh đề thi / câu luyện BẤM ĐỂ PHÓNG TO (17/11/2026).
 *
 * Trước đây ảnh đề (ảnh chụp trang đề gốc — hai cột chữ in rất nhỏ) chỉ là `<img>` co theo bề rộng khung: trên điện
 * thoại chữ nhỏ tới mức không đọc nổi, bấm vào cũng không có gì (người dùng báo, cả app lẫn web). Nay bấm ⇒ mở
 * `AnhLightbox` (trình xem của Messenger): nền tối toàn màn, lăn chuột / chụm hai ngón / nhấp đúp để phóng, kéo để dời,
 * xoay 90° (phím R) cho trang đề nằm ngang, lưu ảnh, Esc để đóng.
 *
 * `hidden`: phòng thi giữ ảnh LUÔN trong DOM và chỉ ẩn/hiện (xem chú thích `QuestionImageToggle` — gắn/gỡ node cạnh
 * khối HTML của đề từng làm React gãy `insertBefore`). Trình xem đi qua portal nên không đụng cây DOM của đề.
 */
import { useState } from 'react';
import { Maximize2 } from 'lucide-react';
import AnhLightbox from '@/components/messaging/AnhLightbox';
import { cn } from '@/lib/utils';

export default function AnhDePhongTo({
  url,
  className,
  imgClassName,
  hidden,
  isVi = true,
}: {
  url: string;
  className?: string;
  imgClassName?: string;
  hidden?: boolean;
  isVi?: boolean;
}) {
  const [mo, datMo] = useState(false);
  const nhan = isVi ? 'Phóng to' : 'Zoom';
  return (
    <>
      <button
        type="button"
        hidden={hidden}
        onClick={() => datMo(true)}
        className={cn('group relative block max-w-full cursor-zoom-in text-left', className)}
        aria-label={isVi ? 'Phóng to ảnh đề' : 'Zoom question image'}
        title={isVi ? 'Bấm để xem to, phóng và xoay ảnh' : 'Click to view full screen'}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={url}
          alt=""
          loading="lazy"
          className={cn('max-w-full rounded-lg border border-[var(--border-color)] transition-opacity group-hover:opacity-90', imgClassName)}
        />
        <span className="pointer-events-none absolute bottom-2 right-2 inline-flex items-center gap-1 rounded-full bg-black/65 px-2.5 py-1 text-xs font-semibold text-white shadow-sm">
          <Maximize2 className="h-3.5 w-3.5" /> {nhan}
        </span>
      </button>
      {mo && (
        <AnhLightbox
          ds={[{ url, ten: 'anh-de', tinId: 0, laGif: false }]}
          chiSo={0}
          onDoi={() => {}}
          onDong={() => datMo(false)}
        />
      )}
    </>
  );
}
