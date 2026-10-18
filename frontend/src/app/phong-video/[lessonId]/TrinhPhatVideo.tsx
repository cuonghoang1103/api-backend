'use client';

/**
 * Trình phát VIDEO RIÊNG (mp4 trên R2) cho phòng học — cùng giao diện điều
 * khiển `DieuKhienYT` với trình phát YouTube, nên phụ đề / mục video / mốc
 * `[mm:ss]` của gia sư tua được y như nhau mà không biết đang phát cái gì.
 *
 * ⚠️ TUA TRƯỚC KHI CÓ METADATA BỊ BỎ QUA. Đặt `currentTime` lúc trình duyệt
 * chưa đọc xong đầu tệp (readyState 0) thì Safari lặng lẽ giữ ở 0 — người
 * học bấm `[3:20]` ngay khi vừa vào phòng mà video vẫn chạy từ đầu. Nên mốc
 * tua được GIỮ LẠI rồi áp ở `loadedmetadata`.
 *
 * `onGiay` chỉ bắn khi số GIÂY NGUYÊN đổi (`timeupdate` bắn ~4 lần/giây) —
 * cùng lý do với `TrinhPhatYT`: cha vẽ lại cả danh sách phụ đề mỗi nhịp.
 */

import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import type { DieuKhienYT } from './TrinhPhatYT';

const TrinhPhatVideo = forwardRef<DieuKhienYT, {
  src: string;
  tieuDe?: string;
  onGiay?: (giay: number) => void;
}>(function TrinhPhatVideo({ src, tieuDe, onGiay }, ref) {
  const vRef = useRef<HTMLVideoElement | null>(null);
  const choTua = useRef<number | null>(null);
  const giayCuoi = useRef(-1);
  const onGiayRef = useRef(onGiay);
  onGiayRef.current = onGiay;

  useImperativeHandle(ref, () => ({
    tuaToi: (giay: number) => {
      const v = vRef.current;
      if (!v) return;
      const g = Math.max(0, giay);
      if (v.readyState < 1) choTua.current = g;
      else v.currentTime = g;
      void v.play().catch(() => { /* trình duyệt chặn tự phát thì thôi */ });
    },
    dangPhat: () => { const v = vRef.current; return !!v && !v.paused && !v.ended; },
    tamDung: () => { vRef.current?.pause(); },
    phat: () => { void vRef.current?.play().catch(() => {}); },
  }), []);

  useEffect(() => { giayCuoi.current = -1; choTua.current = null; }, [src]);

  return (
    <video
      ref={vRef}
      src={src}
      title={tieuDe}
      controls
      playsInline
      preload="metadata"
      className="h-full w-full bg-black object-contain"
      onLoadedMetadata={(e) => {
        const g = choTua.current;
        if (g != null) { choTua.current = null; e.currentTarget.currentTime = g; }
      }}
      onTimeUpdate={(e) => {
        const g = Math.floor(e.currentTarget.currentTime || 0);
        if (g !== giayCuoi.current) { giayCuoi.current = g; onGiayRef.current?.(g); }
      }}
    />
  );
});

export default TrinhPhatVideo;
