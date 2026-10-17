'use client';

/**
 * Trang tải app CT Work riêng — phần chạy ở trình duyệt (nhận diện máy, song ngữ).
 *
 * Luật bố cục giữ như `/download`: MỘT nút lớn cho đúng máy người xem, các bản
 * khác nhỏ bên dưới — đừng bắt người ta tự biết Mac của mình là Intel hay Apple
 * Silicon.
 *
 * Trước khi bản đầu tiên được công bố, GitHub trả 404 cho `/releases/latest` —
 * trang nói thẳng "bản đầu tiên đang được dựng" và trỏ về trang danh sách, chứ
 * không dựng một nút tải trỏ vào tệp chưa tồn tại.
 */
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Bell, Cloud, Laptop, RefreshCw, ShieldCheck, Zap } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { CopyBlock, detectPlatform, type Platform, type ReleaseAsset, type ReleaseInfo } from '../DownloadClient';
import { CTW_COURSE_HREF, episodeVideo } from '@/components/work/help/videos';

/* Tập 12 của loạt "Hướng dẫn CT Work" (app máy tính + điện thoại + phím tắt). Link dán ở
   components/work/help/videos.ts — còn rỗng thì cả khối ẩn. */
const VIDEO_APP = episodeVideo('ctw-12-app-may-tinh-dien-thoai');

const KHO = 'cuonghoang1103/ctwork-desktop';
const RELEASES_PAGE = `https://github.com/${KHO}/releases`;
const RELEASE_BASE = `${RELEASES_PAGE}/latest/download`;
const LATEST_API = `https://api.github.com/repos/${KHO}/releases/latest`;
const NGUONG_CU_MS = 10 * 60 * 1000;

interface Build { id: Platform; label: string; detail: string; file: string }

/* Tên tệp khớp `artifactName` trong desktop/electron-builder.ctwork.yml. */
const buildsFor = (v: string, vi: boolean): Build[] => [
  { id: 'mac-arm', label: 'macOS · Apple Silicon', detail: 'M1, M2, M3, M4', file: `CT-Work-${v}-arm64.dmg` },
  { id: 'mac-intel', label: 'macOS · Intel', detail: vi ? 'Mac đời trước 2020' : 'Macs made before 2020', file: `CT-Work-${v}-x64.dmg` },
  { id: 'windows', label: 'Windows', detail: vi ? '64-bit · Windows 10 và 11' : '64-bit · Windows 10 and 11', file: `CT-Work-Setup-${v}.exe` },
  { id: 'linux', label: 'Linux · AppImage', detail: vi ? 'Chạy trên hầu hết bản phân phối' : 'Runs on most distributions', file: `CT-Work-${v}.AppImage` },
];

const terminalFor = (v: string): { id: Platform | 'linux-deb'; title: string; shell: string; code: string }[] => [
  {
    id: 'mac-arm', title: 'macOS · Apple Silicon', shell: 'Terminal',
    code: `curl -L -o /tmp/CT-Work.dmg "${RELEASE_BASE}/CT-Work-${v}-arm64.dmg" && \\
VOL=$(hdiutil attach /tmp/CT-Work.dmg -nobrowse -noverify | grep -o '/Volumes/.*') && \\
cp -R "$VOL/CT Work.app" /Applications/ && \\
hdiutil detach "$VOL" -quiet && \\
xattr -dr com.apple.quarantine "/Applications/CT Work.app" && \\
rm -f /tmp/CT-Work.dmg && \\
open "/Applications/CT Work.app"`,
  },
  {
    id: 'mac-intel', title: 'macOS · Intel', shell: 'Terminal',
    code: `curl -L -o /tmp/CT-Work.dmg "${RELEASE_BASE}/CT-Work-${v}-x64.dmg" && \\
VOL=$(hdiutil attach /tmp/CT-Work.dmg -nobrowse -noverify | grep -o '/Volumes/.*') && \\
cp -R "$VOL/CT Work.app" /Applications/ && \\
hdiutil detach "$VOL" -quiet && \\
xattr -dr com.apple.quarantine "/Applications/CT Work.app" && \\
rm -f /tmp/CT-Work.dmg && \\
open "/Applications/CT Work.app"`,
  },
  {
    id: 'windows', title: 'Windows', shell: 'PowerShell',
    code: `Invoke-WebRequest -Uri "${RELEASE_BASE}/CT-Work-Setup-${v}.exe" -OutFile "$env:TEMP\\CT-Work-Setup.exe"
Unblock-File "$env:TEMP\\CT-Work-Setup.exe"
Start-Process "$env:TEMP\\CT-Work-Setup.exe"`,
  },
  {
    id: 'linux', title: 'Linux · AppImage', shell: 'bash',
    code: `mkdir -p ~/Applications && \\
curl -L -o ~/Applications/CT-Work.AppImage "${RELEASE_BASE}/CT-Work-${v}.AppImage" && \\
chmod +x ~/Applications/CT-Work.AppImage && \\
~/Applications/CT-Work.AppImage`,
  },
  {
    id: 'linux-deb', title: 'Linux · Debian / Ubuntu (.deb)', shell: 'bash',
    code: `curl -L -o /tmp/ctwork.deb "${RELEASE_BASE}/CT-Work-${v}.deb" && \\
sudo apt install -y /tmp/ctwork.deb && \\
ctwork`,
  },
];

export default function CtWorkDownloadClient({ banPhatHanh }: { banPhatHanh: ReleaseInfo | null }) {
  const { locale } = useTranslation();
  const vi = locale === 'vi';
  const [platform, setPlatform] = useState<Platform>('unknown');
  const [showTerminal, setShowTerminal] = useState(false);
  const [release, setRelease] = useState<ReleaseInfo | null>(banPhatHanh);
  const [lookupFailed, setLookupFailed] = useState(false);

  useEffect(() => { setPlatform(detectPlatform()); }, []);

  useEffect(() => {
    const conTuoi = banPhatHanh?.layLuc !== undefined && Date.now() - banPhatHanh.layLuc < NGUONG_CU_MS;
    if (banPhatHanh && conTuoi) return;
    let alive = true;
    fetch(LATEST_API, { headers: { Accept: 'application/vnd.github+json' } })
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error(String(res.status)))))
      .then((json: { tag_name?: string; name?: string; assets?: ReleaseAsset[] }) => {
        if (!alive) return;
        const tag = String(json.tag_name ?? json.name ?? '').replace(/^v/, '');
        if (!tag) throw new Error('no version');
        setRelease({ version: tag, assets: json.assets ?? [] });
      })
      .catch(() => { if (alive) setLookupFailed(true); });
    return () => { alive = false; };
  }, [banPhatHanh]);

  /* Chưa có bản nào công bố (hoặc GitHub không trả lời) ⇒ không dựng link đoán mò. */
  const chuaCoBan = !release && lookupFailed;
  const version = release?.version ?? '';
  const builds = buildsFor(version || 'x', vi);
  const urlFor = (file: string): string | null =>
    release?.assets.find((a) => a.name === file)?.browser_download_url ?? null;
  const sizeFor = (file: string): string | null => {
    const a = release?.assets.find((x) => x.name === file);
    return a ? `${Math.round(a.size / 1048576)} MB` : null;
  };
  const primary = builds.find((b) => b.id === platform);
  const others = builds.filter((b) => b.id !== platform);
  const terminal = terminalFor(version || 'x');
  const terminalOrdered = [...terminal.filter((t) => t.id === platform), ...terminal.filter((t) => t.id !== platform)];

  const LOI_ICH = [
    { icon: Zap, t: vi ? 'Chỉ có CT Work' : 'Just CT Work', d: vi ? 'Mở app là vào thẳng board của bạn — không lẫn trang học tập, nhạc hay mạng xã hội.' : 'Opens straight to your boards — no courses, music or social feed in the way.' },
    { icon: Cloud, t: vi ? 'Đồng bộ tức thì' : 'Live sync', d: vi ? 'Cùng tài khoản với web và app CuongThai. Kéo thẻ ở đây, cả nhóm thấy ngay ở mọi nơi.' : 'Same account as the web and the CuongThai app. Move a card here, your team sees it everywhere.' },
    { icon: Bell, t: vi ? 'Thông báo của máy' : 'Native notifications', d: vi ? 'Được giao việc, được nhắc tên, sắp hạn nộp — báo ở góc màn hình cả khi app đang ở nền.' : 'Assigned, mentioned, deadline close — notified in the corner even when the app is in the background.' },
    { icon: RefreshCw, t: vi ? 'Tự cập nhật' : 'Updates itself', d: vi ? 'Bản mới tự tải ở nền; bấm một lần để khởi động lại vào bản mới.' : 'New versions download in the background; one click to restart into them.' },
    { icon: Laptop, t: vi ? 'Cài song song' : 'Installs side by side', d: vi ? 'Đã có app CuongThai? Cứ giữ nguyên — hai app cài cạnh nhau, không giẫm dữ liệu.' : 'Already have the CuongThai app? Keep it — the two install side by side.' },
    { icon: ShieldCheck, t: vi ? 'Đăng nhập an toàn' : 'Secure sign-in', d: vi ? 'Phiên lưu trong kho khoá của hệ điều hành; đăng nhập bằng tài khoản, Google hoặc GitHub.' : 'Session kept in the OS keychain; sign in with your account, Google or GitHub.' },
  ];

  return (
    <main className="ctw-dl mx-auto max-w-4xl px-4 pb-20 pt-24 sm:px-6">
      <style>{`
        .ctw-dl { --ctw-a: #8a63ff; --ctw-b: #4f5bd5; --ctw-c: #2299e0; }
        .ctw-dl-grad { background-image: linear-gradient(100deg, var(--ctw-a), var(--ctw-b) 55%, var(--ctw-c)); }
        .ctw-dl-text { background-image: linear-gradient(100deg, var(--ctw-a), var(--ctw-b) 55%, var(--ctw-c)); -webkit-background-clip: text; background-clip: text; color: transparent; }
      `}</style>

      <header className="flex flex-col items-center text-center">
        <img src="/images/ct-work/ct-work-app-icon-512.png" alt="" width={112} height={112} className="h-28 w-28" />
        <p className="mt-4 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--text-secondary)]">
          {vi ? 'App desktop' : 'Desktop app'}
        </p>
        <h1 className="mt-2 text-4xl font-bold tracking-tight sm:text-5xl">
          <span className="ctw-dl-text">CT Work</span> {vi ? 'cho máy tính' : 'for desktop'}
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-[var(--text-secondary)] sm:text-lg">
          {vi
            ? 'Board, sprint, backlog, đồ án, lớp học và AI agent — trong một app riêng, gọn, chỉ có CT Work. Dữ liệu đồng bộ tức thì với web và app CuongThai.'
            : 'Boards, sprints, backlog, capstones, classrooms and AI agents — in a focused app that is only CT Work. Everything syncs live with the web and the CuongThai app.'}
        </p>
        {version && <p className="mt-2 text-sm text-[var(--text-secondary)]">{vi ? 'Phiên bản' : 'Version'} {version}</p>}
      </header>

      <section className="mt-10">
        {chuaCoBan ? (
          <div className="mx-auto max-w-md rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)] p-7 text-center">
            <p className="font-semibold">{vi ? 'Bản đầu tiên đang được dựng' : 'The first release is on its way'}</p>
            <p className="mt-2 text-sm text-[var(--text-secondary)]">
              {vi ? 'Trong lúc chờ, CT Work vẫn dùng đầy đủ trên web — cùng tài khoản, cùng dữ liệu.' : 'Meanwhile CT Work is fully usable on the web — same account, same data.'}
            </p>
            <div className="mt-5 flex flex-wrap justify-center gap-2">
              <Link href="/work" className="ctw-dl-grad inline-flex items-center gap-2 rounded-xl px-5 py-2.5 font-semibold text-white">
                {vi ? 'Mở CT Work trên web' : 'Open CT Work on the web'} <ArrowRight size={16} aria-hidden />
              </Link>
              <a href={RELEASES_PAGE} className="inline-flex items-center rounded-xl border border-[var(--border-color)] px-5 py-2.5 text-sm">
                {vi ? 'Trang bản phát hành' : 'Releases page'}
              </a>
            </div>
          </div>
        ) : primary ? (
          <a
            href={urlFor(primary.file) ?? RELEASES_PAGE}
            className="mx-auto flex max-w-md flex-col items-center rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)] p-7 text-center transition hover:border-[#4f5bd5]"
          >
            <span className="text-lg font-semibold">{vi ? 'Tải cho' : 'Download for'} {primary.label}</span>
            <span className="mt-1 text-sm text-[var(--text-secondary)]">
              {primary.detail}{sizeFor(primary.file) ? ` · ${sizeFor(primary.file)}` : ''}
            </span>
            <span className="ctw-dl-grad mt-5 rounded-xl px-8 py-3 font-semibold text-white">{vi ? 'Tải về' : 'Download'}</span>
          </a>
        ) : (
          <p className="text-center text-[var(--text-secondary)]">{vi ? 'Chọn bản hợp với máy của bạn ở dưới.' : 'Pick the build for your machine below.'}</p>
        )}
      </section>

      {!chuaCoBan && (
        <section className="mx-auto mt-8 max-w-2xl">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-[var(--text-secondary)]">
            {vi ? 'Nền tảng khác' : 'Other platforms'}
          </h2>
          <ul className="grid gap-2">
            {[...others, { id: 'linux' as Platform, label: 'Linux · .deb', detail: 'Debian, Ubuntu', file: `CT-Work-${version}.deb` }].map((b) => (
              <li key={b.file}>
                <a href={urlFor(b.file) ?? RELEASES_PAGE} className="flex items-center justify-between gap-3 rounded-xl border border-[var(--border-color)] px-4 py-3 transition hover:border-[#4f5bd5]">
                  <span className="min-w-0">
                    <span className="font-medium">{b.label}</span>
                    <span className="ml-2 text-sm text-[var(--text-secondary)]">{b.detail}</span>
                  </span>
                  <span className="shrink-0 text-sm text-[var(--text-secondary)]">{sizeFor(b.file) ?? ''}</span>
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}

      {VIDEO_APP && (
        <section className="mx-auto mt-14 max-w-2xl">
          <h2 className="text-center text-2xl font-bold">{vi ? 'Xem app hoạt động' : 'See the app in action'}</h2>
          <p className="mt-2 text-center text-sm text-[var(--text-secondary)]">
            {vi ? VIDEO_APP.title : `${VIDEO_APP.title} (video in Vietnamese)`}
          </p>
          <div className="mt-5 overflow-hidden rounded-2xl border border-[var(--border-color)] bg-black">
            <video src={VIDEO_APP.url} controls preload="none" playsInline className="block aspect-video w-full" title={VIDEO_APP.title} />
          </div>
          <p className="mt-3 text-center text-sm">
            <Link href={CTW_COURSE_HREF} className="text-[#6b7cff] hover:underline">
              {vi ? 'Xem cả loạt 12 video hướng dẫn CT Work' : 'Watch the full 12-part CT Work tutorial series'}
            </Link>
          </p>
        </section>
      )}

      <section className="mt-16">
        <h2 className="text-center text-2xl font-bold">{vi ? 'Vì sao dùng app riêng?' : 'Why a separate app?'}</h2>
        <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {LOI_ICH.map(({ icon: Icon, t, d }) => (
            <li key={t} className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)] p-5">
              <span className="ctw-dl-grad inline-flex h-9 w-9 items-center justify-center rounded-xl text-white"><Icon size={18} aria-hidden /></span>
              <h3 className="mt-3 font-semibold">{t}</h3>
              <p className="mt-1 text-sm leading-relaxed text-[var(--text-secondary)]">{d}</p>
            </li>
          ))}
        </ul>
        <p className="mt-6 text-center text-sm text-[var(--text-secondary)]">
          {vi ? 'Muốn biết CT Work được làm ra thế nào? ' : 'Curious how CT Work was built? '}
          <Link href="/tech-trends/xay-dung-ct-work-cong-cu-quan-ly-du-an-kieu-jira" className="text-[#6b7cff] hover:underline">
            {vi ? 'Đọc câu chuyện xây dựng CT Work' : 'Read the build story'}
          </Link>
        </p>
      </section>

      {!chuaCoBan && (
        <section className="mx-auto mt-14 max-w-2xl">
          <button
            type="button"
            onClick={() => setShowTerminal((x) => !x)}
            className="flex w-full items-center justify-between rounded-2xl border border-[var(--border-color)] px-5 py-4 text-left transition hover:border-[#4f5bd5]"
            aria-expanded={showTerminal}
          >
            <span>
              <span className="font-semibold">{vi ? 'Cài bằng terminal' : 'Install from the terminal'}</span>
              <span className="ml-2 text-sm text-[var(--text-secondary)]">{vi ? 'một lệnh, khỏi bấm' : 'one command'}</span>
            </span>
            <span className="text-[var(--text-secondary)]">{showTerminal ? '−' : '+'}</span>
          </button>
          {showTerminal && (
            <div className="mt-4 grid gap-6">
              {terminalOrdered.map((item) => (
                <div key={item.id}>
                  <div className="mb-2 flex items-center gap-2">
                    <h3 className="text-sm font-semibold">{item.title}</h3>
                    <span className="rounded-md bg-white/10 px-2 py-0.5 text-[11px] uppercase tracking-wide text-[var(--text-secondary)]">{item.shell}</span>
                  </div>
                  <CopyBlock code={item.code} />
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      <section className="mx-auto mt-12 max-w-2xl rounded-2xl border border-amber-500/40 bg-amber-500/10 p-6 text-sm">
        <h2 className="font-semibold text-amber-600 dark:text-amber-400">
          {vi ? 'Lần mở đầu có cảnh báo — chuyện bình thường' : 'The first launch shows a warning — that is expected'}
        </h2>
        <p className="mt-2 text-[var(--text-secondary)]">
          {vi
            ? 'App chưa ký số nên hệ điều hành cảnh báo như với mọi phần mềm chưa đăng ký. App không hỏng và không chứa mã độc; lệnh cài bằng terminal đã tự xử lý việc này.'
            : 'The app is not code-signed yet, so the OS warns about it like any unregistered software. It is not damaged; the terminal install commands handle this for you.'}
        </p>
        <p className="mt-3"><strong>macOS:</strong> {vi ? 'nếu báo "CT Work bị hỏng", chạy:' : 'if it says "CT Work is damaged", run:'}</p>
        <code className="mt-1 block overflow-x-auto rounded-lg bg-black/30 p-2 text-xs">xattr -dr com.apple.quarantine &quot;/Applications/CT Work.app&quot;</code>
        <p className="mt-3"><strong>Windows:</strong> {vi ? 'SmartScreen chặn thì bấm Thêm thông tin → Vẫn chạy.' : 'if SmartScreen blocks it: More info → Run anyway.'}</p>
      </section>

      <p className="mt-10 text-center text-sm text-[var(--text-secondary)]">
        {vi ? 'Cần cả học tập, AI Code, ghi chú…? ' : 'Want courses, AI Code, notes and more too? '}
        <Link href="/download" className="text-[#6b7cff] hover:underline">{vi ? 'Tải app CuongThai đầy đủ' : 'Get the full CuongThai app'}</Link>
        {' · '}
        <Link href="/work" className="text-[#6b7cff] hover:underline">{vi ? 'Dùng CT Work trên web' : 'Use CT Work on the web'}</Link>
      </p>
    </main>
  );
}
