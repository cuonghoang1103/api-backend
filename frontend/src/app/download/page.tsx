'use client';

/**
 * Trang tải ứng dụng desktop.
 *
 * Client component vì nó phải đọc `navigator` để đoán hệ điều hành — việc đó
 * chỉ làm được ở trình duyệt. Nội dung tĩnh nên không ảnh hưởng SEO.
 *
 * Nguyên tắc trình bày: đưa ĐÚNG MỘT nút lớn cho hệ điều hành đang dùng, các
 * bản còn lại xếp nhỏ bên dưới. Bày sáu nút ngang hàng buộc người dùng phải tự
 * biết mình dùng Intel hay Apple Silicon — phần lớn không biết, và đoán sai thì
 * tải về một file không chạy được.
 */

import { useEffect, useState } from 'react';
import Link from 'next/link';

/** Repo phát hành. Đổi ở đây nếu đổi trong desktop/electron-builder.yml. */
const RELEASE_BASE =
  'https://github.com/cuonghoang1103/cuongthai-desktop/releases/latest/download';
const RELEASES_PAGE = 'https://github.com/cuonghoang1103/cuongthai-desktop/releases';

/** Phải khớp `version` trong desktop/package.json. */
const VERSION = '0.1.0';

type Platform = 'mac-arm' | 'mac-intel' | 'windows' | 'linux' | 'unknown';

interface Build {
  id: Platform;
  label: string;
  detail: string;
  file: string;
  size: string;
}

const BUILDS: Build[] = [
  {
    id: 'mac-arm',
    label: 'macOS · Apple Silicon',
    detail: 'M1, M2, M3, M4',
    file: `CuongThai-${VERSION}-arm64.dmg`,
    size: '96 MB',
  },
  {
    id: 'mac-intel',
    label: 'macOS · Intel',
    detail: 'Mac đời trước 2020',
    file: `CuongThai-${VERSION}-x64.dmg`,
    size: '100 MB',
  },
  {
    id: 'windows',
    label: 'Windows',
    detail: '64-bit, Windows 10 trở lên',
    file: `CuongThai-Setup-${VERSION}.exe`,
    size: '~85 MB',
  },
  {
    id: 'linux',
    label: 'Linux · AppImage',
    detail: 'Chạy được trên hầu hết bản phân phối',
    file: `CuongThai-${VERSION}.AppImage`,
    size: '~100 MB',
  },
];

/**
 * Đoán hệ điều hành.
 *
 * Phân biệt Apple Silicon với Intel là chỗ khó: `navigator.platform` trả về
 * "MacIntel" trên CẢ HAI (Apple giữ nguyên chuỗi đó để không phá các trang cũ).
 * Cách phân biệt đáng tin nhất từ trình duyệt là hỏi WebGL xem GPU tên gì —
 * máy Apple Silicon báo "Apple M…", máy Intel báo "Intel" hoặc "AMD".
 */
function detectPlatform(): Platform {
  if (typeof navigator === 'undefined') return 'unknown';

  const ua = navigator.userAgent;
  if (/Windows/i.test(ua)) return 'windows';
  if (/Linux/i.test(ua) && !/Android/i.test(ua)) return 'linux';

  if (/Mac/i.test(ua)) {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl');
      const ext = gl?.getExtension('WEBGL_debug_renderer_info');
      const renderer = ext
        ? String(gl?.getParameter(ext.UNMASKED_RENDERER_WEBGL) ?? '')
        : '';
      if (/Apple\s*M/i.test(renderer)) return 'mac-arm';
      if (renderer) return 'mac-intel';
    } catch {
      /* WebGL bị chặn — rơi xuống phán đoán bên dưới */
    }
    // Không đọc được GPU: đoán Apple Silicon. Từ 2020 mọi máy Mac mới đều là
    // Apple Silicon, nên đoán như vậy đúng với đa số người tải hôm nay.
    return 'mac-arm';
  }

  return 'unknown';
}

export default function DownloadPage() {
  const [platform, setPlatform] = useState<Platform>('unknown');

  useEffect(() => {
    setPlatform(detectPlatform());
  }, []);

  const primary = BUILDS.find((build) => build.id === platform);
  const others = BUILDS.filter((build) => build.id !== platform);

  return (
    <main className="mx-auto max-w-3xl px-5 py-16">
      <header className="text-center">
        <h1 className="text-3xl font-bold sm:text-4xl">Tải CuongThai cho máy tính</h1>
        <p className="mx-auto mt-3 max-w-xl text-[var(--text-secondary)]">
          Ứng dụng desktop với trợ lý Odin, đọc nội dung khi mất mạng, và tự lưu
          nháp cục bộ. Phiên bản {VERSION}.
        </p>
      </header>

      {/* Nút chính cho hệ điều hành đang dùng */}
      <section className="mt-10">
        {primary ? (
          <a
            href={`${RELEASE_BASE}/${primary.file}`}
            className="mx-auto flex max-w-md flex-col items-center rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)] p-7 text-center transition hover:border-indigo-500"
          >
            <span className="text-lg font-semibold">Tải cho {primary.label}</span>
            <span className="mt-1 text-sm text-[var(--text-secondary)]">
              {primary.detail} · {primary.size}
            </span>
            <span className="mt-5 rounded-xl bg-indigo-600 px-7 py-3 font-semibold text-white">
              Tải xuống
            </span>
          </a>
        ) : (
          <p className="text-center text-[var(--text-secondary)]">
            Chọn bản phù hợp với máy của bạn bên dưới.
          </p>
        )}
      </section>

      {/* Các bản còn lại */}
      <section className="mt-10">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-[var(--text-secondary)]">
          Nền tảng khác
        </h2>
        <ul className="grid gap-2">
          {others.map((build) => (
            <li key={build.id}>
              <a
                href={`${RELEASE_BASE}/${build.file}`}
                className="flex items-center justify-between rounded-xl border border-[var(--border-color)] px-4 py-3 transition hover:border-indigo-500"
              >
                <span>
                  <span className="font-medium">{build.label}</span>
                  <span className="ml-2 text-sm text-[var(--text-secondary)]">
                    {build.detail}
                  </span>
                </span>
                <span className="text-sm text-[var(--text-secondary)]">{build.size}</span>
              </a>
            </li>
          ))}
          <li>
            <a
              href={`${RELEASE_BASE}/CuongThai-${VERSION}.deb`}
              className="flex items-center justify-between rounded-xl border border-[var(--border-color)] px-4 py-3 transition hover:border-indigo-500"
            >
              <span>
                <span className="font-medium">Linux · .deb</span>
                <span className="ml-2 text-sm text-[var(--text-secondary)]">
                  Debian, Ubuntu
                </span>
              </span>
              <span className="text-sm text-[var(--text-secondary)]">~100 MB</span>
            </a>
          </li>
        </ul>
      </section>

      {/*
        Cảnh báo về bản chưa ký số.
        Đây KHÔNG phải chi tiết kỹ thuật để giấu đi: người dùng sẽ gặp đúng hộp
        thoại này ngay lần mở đầu tiên, và nếu trang tải không nói trước thì họ
        tin là app có virus rồi xoá.
      */}
      <section className="mt-12 rounded-2xl border border-amber-500/40 bg-amber-500/10 p-6">
        <h2 className="font-semibold text-amber-600 dark:text-amber-400">
          Lần mở đầu tiên sẽ có cảnh báo — đây là bình thường
        </h2>
        <p className="mt-2 text-sm text-[var(--text-secondary)]">
          Ứng dụng chưa mua chứng chỉ ký số, nên hệ điều hành cảnh báo với mọi
          phần mềm chưa đăng ký. App không bị hỏng và không chứa mã độc.
        </p>

        <div className="mt-4 grid gap-4 text-sm">
          <div>
            <div className="font-medium">macOS</div>
            <p className="text-[var(--text-secondary)]">
              Nếu báo &ldquo;app bị hỏng&rdquo;: chuột phải vào ứng dụng trong
              thư mục Applications → chọn <strong>Mở</strong> → <strong>Mở</strong>{' '}
              lần nữa. Hoặc chạy trong Terminal:
            </p>
            <code className="mt-1 block overflow-x-auto rounded-lg bg-black/30 p-2 text-xs">
              xattr -dr com.apple.quarantine /Applications/CuongThai.app
            </code>
          </div>
          <div>
            <div className="font-medium">Windows</div>
            <p className="text-[var(--text-secondary)]">
              Nếu SmartScreen chặn: bấm <strong>Thêm thông tin</strong> →{' '}
              <strong>Vẫn chạy</strong>.
            </p>
          </div>
          <div>
            <div className="font-medium">Linux (AppImage)</div>
            <p className="text-[var(--text-secondary)]">Cấp quyền chạy trước:</p>
            <code className="mt-1 block overflow-x-auto rounded-lg bg-black/30 p-2 text-xs">
              chmod +x CuongThai-{VERSION}.AppImage
            </code>
          </div>
        </div>
      </section>

      <section className="mt-10 text-sm text-[var(--text-secondary)]">
        <h2 className="mb-2 font-semibold text-[var(--text-primary)]">Yêu cầu hệ thống</h2>
        <ul className="list-inside list-disc space-y-1">
          <li>macOS 11 (Big Sur) trở lên</li>
          <li>Windows 10 64-bit trở lên</li>
          <li>Linux có glibc 2.28 trở lên</li>
          <li>Cần kết nối mạng để đăng nhập lần đầu</li>
        </ul>
        <p className="mt-4">
          Ứng dụng tự kiểm tra bản mới. Xem tất cả phiên bản tại{' '}
          <a href={RELEASES_PAGE} className="text-indigo-500 hover:underline">
            trang phát hành
          </a>
          . Chưa muốn cài? <Link href="/dashboard" className="text-indigo-500 hover:underline">
            Dùng bản web
          </Link>
          .
        </p>
      </section>
    </main>
  );
}
