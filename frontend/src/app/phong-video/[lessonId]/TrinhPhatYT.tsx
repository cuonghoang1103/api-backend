'use client';

/**
 * Trình phát YouTube CÓ ĐIỀU KHIỂN — khác với trình phát ở trang học.
 *
 * Trang học chỉ cần biết video dài bao nhiêu và lúc nào hết. Phòng học video
 * cần hai thứ nữa, và cả hai đều bắt buộc:
 *
 *   • TUA tới một giây bất kỳ — bấm một câu phụ đề, hay bấm mốc `[2:19]`
 *     trong câu trả lời của gia sư, là nhảy tới đúng đó.
 *   • ĐỌC giây đang phát — để tô sáng câu phụ đề đang đọc, và để gia sư biết
 *     "đoạn này" là đoạn nào.
 *
 * ⚠️ `onGiay` gọi 4 lần/giây nhưng chỉ khi số GIÂY NGUYÊN đổi. Bắn mọi nhịp
 * thì cha re-render 4 lần/giây và cả danh sách phụ đề (hàng nghìn dòng) vẽ
 * lại theo — trang giật ngay cả khi không ai chạm vào.
 */

import { useEffect, useImperativeHandle, useRef, forwardRef } from 'react';
import { loadYouTubeAPI } from '@/lib/youtube-player';

export interface DieuKhienYT {
  tuaToi: (giay: number) => void;
  dangPhat: () => boolean;
  tamDung: () => void;
  phat: () => void;
}

interface MayPhat {
  seekTo: (s: number, allow: boolean) => void;
  getCurrentTime: () => number;
  getPlayerState: () => number;
  playVideo: () => void;
  pauseVideo: () => void;
  destroy?: () => void;
}

const TrinhPhatYT = forwardRef<DieuKhienYT, {
  videoId: string;
  tieuDe?: string;
  batDau?: number;
  onGiay?: (giay: number) => void;
  onSanSang?: (thoiLuong: number) => void;
}>(function TrinhPhatYT({ videoId, tieuDe, batDau = 0, onGiay, onSanSang }, ref) {
  const voRef = useRef<HTMLDivElement | null>(null);
  const mayRef = useRef<MayPhat | null>(null);
  const onGiayRef = useRef(onGiay);
  const onSanSangRef = useRef(onSanSang);
  onGiayRef.current = onGiay;
  onSanSangRef.current = onSanSang;

  /* `batDau` chỉ dùng cho LẦN DỰNG đầu. Đọc nó qua ref nên việc nó đổi về sau
     (người học tua đi chỗ khác) không dựng lại cả trình phát. */
  const batDauRef = useRef(batDau);

  useImperativeHandle(ref, () => ({
    tuaToi: (giay: number) => {
      const m = mayRef.current;
      if (!m) return;
      /* `true` = cho phép tua VƯỢT phần đã tải. Để `false` thì cú bấm vào một
         mốc ở cuối video trôi về chỗ gần nhất đã đệm — tức là nhảy sai chỗ mà
         không báo gì. */
      m.seekTo(Math.max(0, giay), true);
      try { m.playVideo(); } catch { /* trình duyệt chặn tự phát thì thôi */ }
    },
    dangPhat: () => {
      try { return mayRef.current?.getPlayerState() === window.YT?.PlayerState?.PLAYING; }
      catch { return false; }
    },
    tamDung: () => { try { mayRef.current?.pauseVideo(); } catch { /* bỏ qua */ } },
    phat: () => { try { mayRef.current?.playVideo(); } catch { /* bỏ qua */ } },
  }), []);

  useEffect(() => {
    const vo = voRef.current;
    if (!vo) return;
    let huy = false;
    let nhip: ReturnType<typeof setInterval> | null = null;
    let giayCuoi = -1;

    const o = document.createElement('div');
    const id = `yt-phong-${videoId}-${Math.floor(Math.random() * 1e9)}`;
    o.id = id;
    o.className = 'w-full h-full';
    vo.appendChild(o);

    void loadYouTubeAPI().then(() => {
      if (huy || !window.YT?.Player) return;
      mayRef.current = new window.YT.Player(id, {
        videoId,
        playerVars: {
          rel: 0, modestbranding: 1, playsinline: 1,
          start: Math.max(0, Math.floor(batDauRef.current)),
        },
        events: {
          onReady: (e: unknown) => {
            const m = (e as { target?: { getDuration?: () => number } })?.target;
            const d = m?.getDuration?.();
            if (d && d > 0) onSanSangRef.current?.(d);
            nhip = setInterval(() => {
              try {
                const g = Math.floor(mayRef.current?.getCurrentTime?.() ?? 0);
                if (g !== giayCuoi) { giayCuoi = g; onGiayRef.current?.(g); }
              } catch { /* trình phát đang dựng lại */ }
            }, 250);
          },
        },
      }) as unknown as MayPhat;
    });

    return () => {
      huy = true;
      if (nhip) clearInterval(nhip);
      try { mayRef.current?.destroy?.(); } catch { /* bỏ qua */ }
      mayRef.current = null;
      try { vo.innerHTML = ''; } catch { /* bỏ qua */ }
    };
  }, [videoId]);

  return <div ref={voRef} title={tieuDe} className="w-full h-full" />;
});

export default TrinhPhatYT;
