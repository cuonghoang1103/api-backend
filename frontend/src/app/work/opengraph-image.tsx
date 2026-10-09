import { genericImage } from '@/lib/og/ctWorkCards';

// UX-D: ảnh xem trước chung của /work (không biết workspace) — "CT Work · Sign in to view".
export const runtime = 'nodejs';
export const alt = 'CT Work by CuongThai — sign in to view';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function Image() {
  return genericImage();
}
