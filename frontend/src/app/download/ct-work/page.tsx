/**
 * Trang tải app desktop RIÊNG của CT Work (13/10/2026).
 *
 * Cùng cách làm với `/download` (app CuongThai) — máy chủ hỏi GitHub một lần,
 * đệm 5 phút, địa chỉ tải LUÔN là `browser_download_url` GitHub trả về, không
 * bao giờ ghép tay tên tệp. Đọc chú thích ở `../page.tsx` để biết vì sao.
 *
 * Kho phát hành: `cuonghoang1103/ctwork-desktop` (public — electron-updater tải
 * bản mới không kèm token). Giữ khớp với `desktop/electron-builder.ctwork.yml`.
 */
import type { Metadata } from 'next';
import CtWorkDownloadClient from './CtWorkDownloadClient';
import type { ReleaseInfo } from '../DownloadClient';

export const revalidate = 300;

export const metadata: Metadata = {
  title: 'Tải CT Work cho máy tính — macOS, Windows, Linux',
  description:
    'App desktop riêng của CT Work: board, sprint, backlog, đồ án, lớp học và AI agent — chỉ CT Work, đồng bộ tức thì với web và app CuongThai.',
  openGraph: {
    title: 'CT Work cho máy tính',
    description: 'Quản lý dự án, đồ án và lớp học kiểu Jira — app riêng cho macOS, Windows và Linux.',
    images: ['/images/ct-work/ct-work-app-icon-1024.png'],
  },
};

const LATEST_API = 'https://api.github.com/repos/cuonghoang1103/ctwork-desktop/releases/latest';

async function layBanPhatHanh(): Promise<ReleaseInfo | null> {
  try {
    const res = await fetch(LATEST_API, {
      headers: { Accept: 'application/vnd.github+json' },
      next: { revalidate: 300 },
    });
    if (!res.ok) return null;
    const json = (await res.json()) as {
      tag_name?: string;
      name?: string;
      assets?: { name: string; browser_download_url: string; size: number }[];
    };
    const version = String(json.tag_name ?? json.name ?? '').replace(/^v/, '');
    if (!version) return null;
    return { version, assets: json.assets ?? [], layLuc: Date.now() };
  } catch {
    return null;
  }
}

export default async function CtWorkDownloadPage() {
  const banPhatHanh = await layBanPhatHanh();
  return <CtWorkDownloadClient banPhatHanh={banPhatHanh} />;
}
