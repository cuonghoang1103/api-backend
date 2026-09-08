'use client';

/**
 * Khung nhúng video TỐI GIẢN — dựng riêng cho lớp phủ của app desktop.
 *
 * ─── Vì sao cần một trang riêng ───
 * App chạy ở origin `app://cuongthai`. Khung nhúng YouTube đòi trang cha có
 * ORIGIN THẬT và phải là bên thứ ba, nên nhúng thẳng từ `app://` chỉ ra
 * "Video player configuration error" (152/153) — đã đo trên iOS đúng kiểu này.
 * Vì thế app trước đây nạp NGUYÊN trang `youtube.com/watch` vào lớp phủ rồi
 * cắt bớt bằng CSS: nó kéo theo cả quảng cáo, cột gợi ý và bố cục của
 * YouTube — vừa nặng vừa lệch khung, và CSS chỉ GIẤU chứ không ngăn tải.
 *
 * Trang này là đường thứ ba: lớp phủ nạp CHÍNH TRANG NÀY của cuongthai.com.
 * Origin là thật (giống hệt lúc nhúng trên web, vốn đã chạy), còn bố cục thì
 * do mình quyết — iframe lấp đúng 100% khung, không còn gì khác để tải.
 *
 * Cố ý KHÔNG có: header, nav, theme provider, phân tích. Mỗi byte ở đây đều
 * nằm trên đường tới lúc video bắt đầu chạy.
 */
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

/** Lấy id video từ mọi dạng link YouTube hay gặp. Trả `''` nếu không nhận ra. */
function maYouTube(raw: string): string {
  const s = (raw || '').trim();
  if (!s) return '';
  // Đã là id trần (11 ký tự) thì dùng luôn.
  if (/^[\w-]{11}$/.test(s)) return s;
  const m = s.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{11})/);
  return m?.[1] ?? '';
}

function Khung() {
  const sp = useSearchParams();
  const ma = maYouTube(sp.get('v') ?? '');

  if (!ma) {
    return (
      <div style={{ color: '#888', font: '14px system-ui', padding: 24 }}>
        Không nhận ra video từ đường dẫn này.
      </div>
    );
  }

  return (
    <iframe
      // `youtube-nocookie` để không dính cookie theo dõi cho một khung chỉ để xem bài học.
      src={`https://www.youtube-nocookie.com/embed/${ma}?rel=0&modestbranding=1&playsinline=1`}
      title="Video bài học"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
      allowFullScreen
      style={{ position: 'fixed', inset: 0, width: '100%', height: '100%', border: 0 }}
    />
  );
}

export default function NhungVideo() {
  return (
    <div style={{ position: 'fixed', inset: 0, background: '#000', overflow: 'hidden' }}>
      {/* `useSearchParams` bắt buộc phải nằm trong Suspense ở App Router. */}
      <Suspense fallback={null}>
        <Khung />
      </Suspense>
    </div>
  );
}
