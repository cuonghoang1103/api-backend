'use client';

/**
 * Desktop app download page.
 *
 * English-only by design: this page is the app's public front door, and the
 * terminal snippets below are commands — mixing a localized UI around raw
 * shell commands makes people unsure which parts they may edit.
 *
 * Client component because OS detection needs `navigator`. Content is static,
 * so nothing is lost for SEO.
 *
 * Layout rule: ONE big button for the visitor's own OS, everything else small
 * and below. Six equal buttons force people to know whether their Mac is Intel
 * or Apple Silicon — most don't, and a wrong guess downloads a file that will
 * not run.
 */

import { useEffect, useState } from 'react';
import Link from 'next/link';

/** Release repo. Keep in sync with desktop/electron-builder.yml. */
const RELEASE_BASE =
  'https://github.com/cuonghoang1103/cuongthai-desktop/releases/latest/download';
const RELEASES_PAGE = 'https://github.com/cuonghoang1103/cuongthai-desktop/releases';

/**
 * Phiên bản DỰ PHÒNG, chỉ dùng khi không hỏi được GitHub.
 *
 * ⚠️ ĐỪNG dựa vào hằng số này để dựng link tải. Trước 18/08/2026 trang này ghép
 * `/releases/latest/download` (LUÔN trỏ bản mới nhất) với một số phiên bản gõ
 * cứng ở đây, nên nó chỉ đúng đúng một khoảnh khắc: lúc ai đó vừa sửa tay con
 * số. Từ bản 0.3.0 trở đi mọi nút tải đều 404 — địa chỉ hỏi
 * `CuongThai-Setup-0.2.1.exe` trong bản phát hành 0.5.2, và file đó không tồn
 * tại ở đó. Không có gì báo lỗi vì hằng số vẫn "hợp lệ".
 *
 * Phiên bản thật lấy từ GitHub lúc mở trang. Hỏng thì nút tải trỏ về trang
 * danh sách bản phát hành — người dùng tự chọn — chứ KHÔNG bao giờ trỏ vào một
 * địa chỉ đoán mò.
 */
const FALLBACK_VERSION = '0.5.14';
const LATEST_API = 'https://api.github.com/repos/cuonghoang1103/cuongthai-desktop/releases/latest';

export interface ReleaseAsset { name: string; browser_download_url: string; size: number }
export interface ReleaseInfo {
  version: string;
  assets: ReleaseAsset[];
  /** Mốc máy chủ lấy dữ liệu (ms). Vắng mặt = dữ liệu do chính client lấy. */
  layLuc?: number;
}

/**
 * Dữ liệu của máy chủ cũ hơn ngần này thì client tự hỏi lại GitHub.
 *
 * Trang được dựng lại mỗi 5 phút, nhưng người đầu tiên ghé sau khi bộ đệm hết
 * hạn vẫn được trả BẢN CŨ trong lúc bản mới đang dựng ngầm — đó là cách ISR
 * hoạt động, và với người đang đi tải app thì "cũ vài phút" là thấy sai số
 * phiên bản. Ngưỡng 10 phút: người ghé lúc trang còn tươi thì KHÔNG tốn lượt
 * gọi GitHub nào, chỉ ai rơi vào trang cũ mới phải hỏi.
 */
const NGUONG_CU_MS = 10 * 60 * 1000;

type Platform = 'mac-arm' | 'mac-intel' | 'windows' | 'linux' | 'unknown';

interface Build {
  id: Platform;
  label: string;
  detail: string;
  file: string;
  size: string;
}

const buildsFor = (VERSION: string): Build[] => [
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
    detail: 'Macs made before 2020',
    file: `CuongThai-${VERSION}-x64.dmg`,
    size: '100 MB',
  },
  {
    id: 'windows',
    label: 'Windows',
    detail: '64-bit · Windows 10 và 11 (cùng một bản cài)',
    file: `CuongThai-Setup-${VERSION}.exe`,
    size: '~85 MB',
  },
  {
    id: 'linux',
    label: 'Linux · AppImage',
    detail: 'Runs on most distributions',
    file: `CuongThai-${VERSION}.AppImage`,
    size: '~100 MB',
  },
];

/**
 * Guess the visitor's platform.
 *
 * Telling Apple Silicon from Intel is the hard part: `navigator.platform`
 * returns "MacIntel" on BOTH (Apple kept the string so old sites keep working).
 * The most reliable browser-side signal is the WebGL renderer name — Apple
 * Silicon reports "Apple M…", Intel Macs report "Intel" or "AMD".
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
      /* WebGL blocked — fall through to the guess below */
    }
    // Can't read the GPU: assume Apple Silicon. Every Mac sold since 2020 is
    // Apple Silicon, so this is right for the large majority of visitors.
    return 'mac-arm';
  }

  return 'unknown';
}

/**
 * One-line terminal installers.
 *
 * Each command does the whole job — download, install, and clear the OS
 * quarantine flag — so there is nothing left to explain afterwards. They are
 * written to be *readable*: no piping a remote script straight into a shell,
 * because nobody can audit what they are about to run that way.
 */
const terminalFor = (VERSION: string): { id: Platform | 'linux-deb'; title: string; shell: string; code: string }[] => [
  {
    id: 'mac-arm',
    title: 'macOS · Apple Silicon (M1–M4)',
    shell: 'Terminal',
    // Lấy điểm mount TỪ ĐẦU RA của hdiutil thay vì gõ cứng tên ổ đĩa.
    // Tên ổ do `dmg.title` quyết định và nó đã đổi một lần rồi — lệnh gõ cứng
    // sẽ hỏng câm với bản phát hành cũ hoặc mới, tuỳ lúc viết.
    code: `curl -L -o /tmp/CuongThai.dmg "${RELEASE_BASE}/CuongThai-${VERSION}-arm64.dmg" && \\
VOL=$(hdiutil attach /tmp/CuongThai.dmg -nobrowse -noverify | grep -o '/Volumes/.*') && \\
cp -R "$VOL/CuongThai.app" /Applications/ && \\
hdiutil detach "$VOL" -quiet && \\
xattr -dr com.apple.quarantine /Applications/CuongThai.app && \\
rm -f /tmp/CuongThai.dmg && \\
open /Applications/CuongThai.app`,
  },
  {
    id: 'mac-intel',
    title: 'macOS · Intel',
    shell: 'Terminal',
    // Lấy điểm mount TỪ ĐẦU RA của hdiutil thay vì gõ cứng tên ổ đĩa.
    // Tên ổ do `dmg.title` quyết định và nó đã đổi một lần rồi — lệnh gõ cứng
    // sẽ hỏng câm với bản phát hành cũ hoặc mới, tuỳ lúc viết.
    code: `curl -L -o /tmp/CuongThai.dmg "${RELEASE_BASE}/CuongThai-${VERSION}-x64.dmg" && \\
VOL=$(hdiutil attach /tmp/CuongThai.dmg -nobrowse -noverify | grep -o '/Volumes/.*') && \\
cp -R "$VOL/CuongThai.app" /Applications/ && \\
hdiutil detach "$VOL" -quiet && \\
xattr -dr com.apple.quarantine /Applications/CuongThai.app && \\
rm -f /tmp/CuongThai.dmg && \\
open /Applications/CuongThai.app`,
  },
  {
    id: 'windows',
    title: 'Windows',
    shell: 'PowerShell',
    code: `Invoke-WebRequest -Uri "${RELEASE_BASE}/CuongThai-Setup-${VERSION}.exe" -OutFile "$env:TEMP\\CuongThai-Setup.exe"
Unblock-File "$env:TEMP\\CuongThai-Setup.exe"
Start-Process "$env:TEMP\\CuongThai-Setup.exe"`,
  },
  {
    id: 'linux',
    title: 'Linux · AppImage (any distro)',
    shell: 'bash',
    code: `mkdir -p ~/Applications && \\
curl -L -o ~/Applications/CuongThai.AppImage "${RELEASE_BASE}/CuongThai-${VERSION}.AppImage" && \\
chmod +x ~/Applications/CuongThai.AppImage && \\
~/Applications/CuongThai.AppImage`,
  },
  {
    id: 'linux-deb',
    title: 'Linux · Debian / Ubuntu (.deb)',
    shell: 'bash',
    code: `curl -L -o /tmp/cuongthai.deb "${RELEASE_BASE}/CuongThai-${VERSION}.deb" && \\
sudo apt install -y /tmp/cuongthai.deb && \\
cuongthai`,
  },
];

function CopyBlock({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  return (
    <div className="relative">
      <pre className="overflow-x-auto rounded-xl bg-black/40 p-4 pr-24 text-xs leading-relaxed">
        <code>{code}</code>
      </pre>
      <button
        type="button"
        onClick={() => {
          void navigator.clipboard.writeText(code).then(() => {
            setCopied(true);
            // Reset so the button works a second time — a permanently "Copied"
            // button leaves people unsure whether the second click did anything.
            setTimeout(() => setCopied(false), 2000);
          });
        }}
        className="absolute right-3 top-3 rounded-lg bg-white/10 px-3 py-1.5 text-xs font-medium transition hover:bg-white/20"
      >
        {copied ? 'Copied' : 'Copy'}
      </button>
    </div>
  );
}

export default function DownloadClient({ banPhatHanh }: { banPhatHanh: ReleaseInfo | null }) {
  const [platform, setPlatform] = useState<Platform>('unknown');
  const [showTerminal, setShowTerminal] = useState(false);
  const [release, setRelease] = useState<ReleaseInfo | null>(banPhatHanh);
  /** Hỏi GitHub hỏng (mất mạng, hoặc chạm trần 60 lượt/giờ cho mỗi IP). */
  const [lookupFailed, setLookupFailed] = useState(false);

  useEffect(() => {
    setPlatform(detectPlatform());
  }, []);

  useEffect(() => {
    /* Máy chủ đã lấy được rồi thì THÔI — đừng bắt trình duyệt hỏi lại.
     *
     * API công khai của GitHub chỉ cho 60 lượt/giờ TÍNH THEO IP. Một văn phòng
     * hay quán cà phê dùng chung một IP là chạm trần rất nhanh, và khi đó mọi
     * người ở đó đều thấy nút tải rơi về trang danh sách. Đường máy chủ (xem
     * `page.tsx`) hỏi một lần rồi dùng chung cho tất cả trong 5 phút.
     *
     * Chỉ hỏi ở đây khi máy chủ trượt — mất mạng lúc dựng trang, hoặc GitHub
     * lỗi đúng lúc đó. */
    const conTuoi = banPhatHanh?.layLuc !== undefined
      && Date.now() - banPhatHanh.layLuc < NGUONG_CU_MS;
    if (banPhatHanh && conTuoi) return;
    let alive = true;
    fetch(LATEST_API, { headers: { Accept: 'application/vnd.github+json' } })
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error(String(res.status)))))
      .then((json: { tag_name?: string; name?: string; assets?: ReleaseAsset[] }) => {
        if (!alive) return;
        const tag = String(json.tag_name ?? json.name ?? '').replace(/^v/, '');
        if (!tag) throw new Error('không đọc được số phiên bản');
        setRelease({ version: tag, assets: json.assets ?? [] });
      })
      .catch(() => { if (alive) setLookupFailed(true); });
    return () => { alive = false; };
  }, [banPhatHanh]);

  const version = release?.version ?? FALLBACK_VERSION;
  const builds = buildsFor(version);
  const terminal = terminalFor(version);

  /**
   * Địa chỉ tải của một file.
   *
   * Ưu tiên `browser_download_url` mà GitHub trả về — đó là địa chỉ THẬT, không
   * phải tên file đoán ra. Không tìm thấy thì trả null, và nút sẽ trỏ về trang
   * danh sách bản phát hành. Thà bắt người dùng bấm thêm một lần còn hơn ném
   * họ vào một trang 404.
   */
  const urlFor = (file: string): string | null => {
    const asset = release?.assets.find((a) => a.name === file);
    if (asset) return asset.browser_download_url;
    return release ? null : (lookupFailed ? null : `${RELEASE_BASE}/${file}`);
  };

  /**
   * Dung lượng thật của file, lấy từ GitHub.
   *
   * Con số gõ trong `buildsFor` chỉ là ước lượng lúc viết trang và đã lệch xa:
   * ghi "~85 MB" cho Windows trong khi bản 0.5.3 nặng 114 MB. Người dùng mạng
   * yếu đọc con số đó để quyết định có tải hay không, nên sai 30 MB là sai thật.
   */
  const sizeFor = (file: string, fallback: string): string => {
    const asset = release?.assets.find((a) => a.name === file);
    return asset ? `${Math.round(asset.size / 1048576)} MB` : fallback;
  };

  const primary = builds.find((build) => build.id === platform);
  const others = builds.filter((build) => build.id !== platform);

  // Put the visitor's own OS first in the terminal list, but keep all of them
  // visible — people install on machines they are not currently sitting at.
  const terminalOrdered = [
    ...terminal.filter((t) => t.id === platform),
    ...terminal.filter((t) => t.id !== platform),
  ];

  return (
    <main className="mx-auto max-w-3xl px-5 py-16">
      <header className="text-center">
        <h1 className="text-3xl font-bold sm:text-4xl">Get CuongThai for desktop</h1>
        <p className="mx-auto mt-3 max-w-xl text-[var(--text-secondary)]">
          Your workspace as a native app — with Odin the assistant, offline
          reading, and drafts that never get lost. Version {version}.
        </p>
      </header>

      <section className="mt-10">
        {primary ? (
          <a
            href={urlFor(primary.file) ?? RELEASES_PAGE}
            className="mx-auto flex max-w-md flex-col items-center rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)] p-7 text-center transition hover:border-indigo-500"
          >
            <span className="text-lg font-semibold">Download for {primary.label}</span>
            <span className="mt-1 text-sm text-[var(--text-secondary)]">
              {primary.detail} · {sizeFor(primary.file, primary.size)}
            </span>
            <span className="mt-5 rounded-xl bg-indigo-600 px-7 py-3 font-semibold text-white">
              Download
            </span>
          </a>
        ) : (
          <p className="text-center text-[var(--text-secondary)]">
            Pick the build that matches your machine below.
          </p>
        )}
      </section>

      <section className="mt-10">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-[var(--text-secondary)]">
          Other platforms
        </h2>
        <ul className="grid gap-2">
          {others.map((build) => (
            <li key={build.id}>
              <a
                href={urlFor(build.file) ?? RELEASES_PAGE}
                className="flex items-center justify-between rounded-xl border border-[var(--border-color)] px-4 py-3 transition hover:border-indigo-500"
              >
                <span>
                  <span className="font-medium">{build.label}</span>
                  <span className="ml-2 text-sm text-[var(--text-secondary)]">
                    {build.detail}
                  </span>
                </span>
                <span className="text-sm text-[var(--text-secondary)]">{sizeFor(build.file, build.size)}</span>
              </a>
            </li>
          ))}
          <li>
            <a
              href={urlFor(`CuongThai-${version}.deb`) ?? RELEASES_PAGE}
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

      {/* ── Terminal install ─────────────────────────────────── */}
      <section className="mt-12">
        <button
          type="button"
          onClick={() => setShowTerminal((value) => !value)}
          className="flex w-full items-center justify-between rounded-2xl border border-[var(--border-color)] px-5 py-4 text-left transition hover:border-indigo-500"
          aria-expanded={showTerminal}
        >
          <span>
            <span className="font-semibold">Install from the terminal</span>
            <span className="ml-2 text-sm text-[var(--text-secondary)]">
              one command, no clicking around
            </span>
          </span>
          <span className="text-[var(--text-secondary)]">{showTerminal ? '−' : '+'}</span>
        </button>

        {showTerminal && (
          <div className="mt-4 grid gap-6">
            <p className="text-sm text-[var(--text-secondary)]">
              Each command downloads the app, installs it, and clears the
              operating-system quarantine flag — so you will not see the
              &ldquo;unidentified developer&rdquo; warning afterwards. Copy the
              block for your system and paste it in.
            </p>

            {terminalOrdered.map((item) => (
              <div key={item.id}>
                <div className="mb-2 flex items-center gap-2">
                  <h3 className="text-sm font-semibold">{item.title}</h3>
                  <span className="rounded-md bg-white/10 px-2 py-0.5 text-[11px] uppercase tracking-wide text-[var(--text-secondary)]">
                    {item.shell}
                  </span>
                  {item.id === platform && (
                    <span className="rounded-md bg-indigo-600/20 px-2 py-0.5 text-[11px] font-medium text-indigo-400">
                      your system
                    </span>
                  )}
                </div>
                <CopyBlock code={item.code} />
              </div>
            ))}

            <p className="text-xs text-[var(--text-secondary)]">
              These commands are written out in full on purpose — you can read
              exactly what they do before running them. We deliberately do not
              offer a <code>curl … | bash</code> one-liner: piping a remote
              script straight into your shell means running code you never saw.
            </p>
          </div>
        )}
      </section>

      {/* ── Unsigned build warning ───────────────────────────── */}
      <section className="mt-12 rounded-2xl border border-amber-500/40 bg-amber-500/10 p-6">
        <h2 className="font-semibold text-amber-600 dark:text-amber-400">
          The first launch shows a warning — that is expected
        </h2>
        <p className="mt-2 text-sm text-[var(--text-secondary)]">
          The app is not code-signed yet, so operating systems warn about it the
          way they warn about any unregistered software. The app is not damaged
          and contains no malware. The terminal commands above already handle
          this for you.
        </p>

        <div className="mt-4 grid gap-4 text-sm">
          <div>
            <div className="font-medium">macOS</div>
            <p className="text-[var(--text-secondary)]">
              If it says <em>&ldquo;CuongThai is damaged and can&rsquo;t be
              opened&rdquo;</em>: right-click the app in Applications →{' '}
              <strong>Open</strong> → <strong>Open</strong> again. Or run:
            </p>
            <code className="mt-1 block overflow-x-auto rounded-lg bg-black/30 p-2 text-xs">
              xattr -dr com.apple.quarantine /Applications/CuongThai.app
            </code>
          </div>
          <div>
            <div className="font-medium">Windows</div>
            <p className="text-[var(--text-secondary)]">
              If SmartScreen blocks it: click <strong>More info</strong> →{' '}
              <strong>Run anyway</strong>.
            </p>
          </div>
          <div>
            <div className="font-medium">Linux (AppImage)</div>
            <p className="text-[var(--text-secondary)]">Make it executable first:</p>
            <code className="mt-1 block overflow-x-auto rounded-lg bg-black/30 p-2 text-xs">
              chmod +x CuongThai-{version}.AppImage
            </code>
          </div>
        </div>
      </section>

      <section className="mt-10 text-sm text-[var(--text-secondary)]">
        <h2 className="mb-2 font-semibold text-[var(--text-primary)]">Requirements</h2>
        <ul className="list-inside list-disc space-y-1">
          <li>macOS 11 (Big Sur) or later</li>
          <li>Windows 10 64-bit or later</li>
          <li>Linux with glibc 2.28 or later</li>
          <li>An internet connection for the first sign-in</li>
        </ul>
        <p className="mt-4">
          The app checks for updates on its own. Browse every version on the{' '}
          <a href={RELEASES_PAGE} className="text-indigo-500 hover:underline">
            releases page
          </a>
          . Not ready to install?{' '}
          <Link href="/dashboard" className="text-indigo-500 hover:underline">
            Keep using the web app
          </Link>
          .
        </p>
      </section>
    </main>
  );
}
