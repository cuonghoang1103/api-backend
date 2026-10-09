import { siteImage } from '@/lib/og/siteCards';

// UX-D: ảnh xem trước riêng (Âm nhạc) — tiêu đề thật của trang thay vì ảnh chung của cả site.
export const runtime = 'nodejs';
export const alt = 'Âm nhạc · CuongThai';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image() {
  return siteImage({ kind: 'Âm nhạc', title: 'Cyber Music — nghe nhạc cùng nhau', subtitle: 'Playlist, lời bài hát, remix và phòng nghe chung theo thời gian thực trên CuongThai.', meta: ['Playlists', 'Lyrics', 'Listen together'], accent: ['#ec4899', '#06b6d4'] });
}
