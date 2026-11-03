/**
 * "What I've built" on /about (03/11/2026). Same rule as the rest of the page:
 * every claim here is checkable, and every link was opened before it went in
 * (see `lib/appLinks.ts` for the store/release links and how they were checked).
 *
 * Sources for the descriptions: the App Store listing of CT Work, the
 * /download/ct-work and /download pages, /ai-code and /cli metadata, the VS
 * Code Marketplace listing, and `about/studio/content.ts` + `cases.ts`.
 *
 * ⚠️ The main CuongThai iOS app is in TestFlight testing — it is listed with
 * that status and gets NO App Store badge. Only CT Work is on the App Store.
 */
import {
  CTWORK_APP_STORE,
  CTWORK_DESKTOP_RELEASES,
  CUONGMINI_VSCODE_MARKETPLACE,
  CUONGTHAI_DESKTOP_RELEASES,
} from '@/lib/appLinks';
import type { Bi } from './aboutData';

const L = (en: string, vi: string): Bi => ({ en, vi });

export interface BuiltLink {
  href: string;
  label: Bi;
  external?: boolean;
}

export interface BuiltProduct {
  id: string;
  name: string;
  /** Path to a square icon under `public/`; none ⇒ a letter tile. */
  icon?: string;
  kind: Bi;
  what: Bi;
  platforms: Bi;
  status: Bi;
  /** 'live' = public and running · 'testing' = not public yet. */
  state: 'live' | 'testing';
  /** CT Work only: link to its App Store page (renders Apple's badge). */
  appStore?: string;
  links: BuiltLink[];
}

export const BUILT: BuiltProduct[] = [
  {
    id: 'ctwork',
    name: 'CT Work',
    icon: '/images/ct-work/ct-work-app-icon-192.png',
    kind: L('Project management for student teams', 'Quản lý dự án cho nhóm sinh viên'),
    what: L(
      'A Jira-style tracker for the projects students actually run: boards, backlog and sprints, docs, test reports in FPT University’s templates, meetings, team chat, and CuongMini, an AI assistant that knows the project. The iPhone and iPad app is native, and everything syncs live with the web and desktop.',
      'Công cụ quản lý dự án kiểu Jira cho đúng những dự án sinh viên làm: board, backlog và sprint, tài liệu, báo cáo kiểm thử theo mẫu của Đại học FPT, cuộc họp, chat nhóm, và CuongMini, trợ lý AI hiểu dự án của bạn. App iPhone và iPad viết native, mọi thứ đồng bộ tức thì với web và app máy tính.',
    ),
    platforms: L('Web · macOS, Windows, Linux · iPhone & iPad (iOS 17+)', 'Web · macOS, Windows, Linux · iPhone & iPad (iOS 17+)'),
    status: L('Live, free — new on the App Store (Nov 2026)', 'Đang chạy, miễn phí — vừa lên App Store (11/2026)'),
    state: 'live',
    appStore: CTWORK_APP_STORE,
    links: [
      { href: '/work', label: L('Open on the web', 'Mở trên web') },
      { href: '/download/ct-work', label: L('Desktop app', 'App máy tính') },
      { href: CTWORK_DESKTOP_RELEASES, label: L('Releases on GitHub', 'Bản phát hành trên GitHub'), external: true },
      { href: '/about/studio/case/ct-work', label: L('Case study', 'Case study') },
    ],
  },
  {
    id: 'cuongmini',
    name: 'CuongMini',
    icon: '/images/cuongmini-code/icon.png',
    kind: L('The site’s AI assistant', 'Trợ lý AI của trang'),
    what: L(
      'One assistant in several places: AI Chat on the web, a coding agent inside VS Code and Cursor, a CLI for the terminal, and the Ask AI panel in CT Work. In code it reads, edits and runs commands, and asks before it acts.',
      'Một trợ lý ở nhiều nơi: AI Chat trên web, agent lập trình ngay trong VS Code và Cursor, CLI cho terminal, và khung Ask AI trong CT Work. Với code, nó đọc, sửa, chạy lệnh và hỏi bạn trước khi làm.',
    ),
    platforms: L('Web · VS Code Marketplace & Open VSX · macOS, Windows, Linux terminal', 'Web · VS Code Marketplace & Open VSX · terminal macOS, Windows, Linux'),
    status: L('Live', 'Đang chạy'),
    state: 'live',
    links: [
      { href: '/chat', label: L('AI Chat', 'AI Chat') },
      { href: '/ai-code', label: L('For VS Code & Cursor', 'Cho VS Code & Cursor') },
      { href: CUONGMINI_VSCODE_MARKETPLACE, label: L('VS Code Marketplace', 'VS Code Marketplace'), external: true },
      { href: '/cli', label: L('CLI', 'CLI') },
    ],
  },
  {
    id: 'site',
    name: 'cuongthai.com',
    icon: '/android-chrome-192x192.png',
    kind: L('This learning platform', 'Chính nền tảng học tập này'),
    what: L(
      'Academy (FPT University subjects with slides, notes and exam practice), self-paced courses with video lessons, Code Lab with automatically graded exercises, real past exam papers, language learning and interview practice. Self-hosted on my own VPS.',
      'Academy (các môn Đại học FPT với slide, ghi chú và luyện đề), khoá học tự học có video bài giảng, Code Lab với bài tập chấm tự động, đề thi thật các kỳ trước, học ngoại ngữ và luyện phỏng vấn. Tự vận hành trên VPS riêng.',
    ),
    platforms: L('Web, plus the desktop and iOS apps on the same API', 'Web, cùng app máy tính và iOS dùng chung một API'),
    status: L('In production', 'Đang chạy production'),
    state: 'live',
    links: [
      { href: '#site', label: L('About this website', 'Về trang web') },
      { href: '/about/studio/case/cuongthai-com', label: L('Case study', 'Case study') },
    ],
  },
  {
    id: 'desktop',
    name: 'CuongThai Desktop',
    icon: '/android-chrome-192x192.png',
    kind: L('Desktop app', 'App máy tính'),
    what: L(
      'The whole site as an Electron app for macOS, Windows and Linux. It updates itself from public GitHub releases and includes the AI Code tool that works on your own project folder.',
      'Cả trang web trong một app Electron cho macOS, Windows và Linux. App tự cập nhật từ bản phát hành công khai trên GitHub và có công cụ AI Code làm việc trên thư mục dự án của bạn.',
    ),
    platforms: L('macOS, Windows, Linux', 'macOS, Windows, Linux'),
    status: L('Publicly released, auto-updating', 'Phát hành công khai, tự cập nhật'),
    state: 'live',
    links: [
      { href: '/download', label: L('Download', 'Tải về') },
      { href: CUONGTHAI_DESKTOP_RELEASES, label: L('Releases on GitHub', 'Bản phát hành trên GitHub'), external: true },
      { href: '/about/studio/case/cuongthai-desktop', label: L('Case study', 'Case study') },
    ],
  },
  {
    id: 'ios',
    name: 'CuongThai iOS',
    icon: '/apple-touch-icon.png',
    kind: L('iPhone & iPad app', 'App iPhone & iPad'),
    what: L(
      'A SwiftUI app synced with this site: study by major, handwritten notebooks on iPad, a book library.',
      'App SwiftUI đồng bộ với trang: học theo ngành, vở viết tay trên iPad, thư viện sách.',
    ),
    platforms: L('iPhone, iPad', 'iPhone, iPad'),
    status: L('In TestFlight testing — not on the App Store yet', 'Đang thử nghiệm qua TestFlight — chưa lên App Store'),
    state: 'testing',
    links: [{ href: '/about/studio/case/cuongthai-ios', label: L('Case study', 'Case study') }],
  },
  {
    id: 'labflow',
    name: 'LabFlow AI',
    kind: L('Graduation project', 'Đồ án tốt nghiệp'),
    what: L(
      'A lab-room and equipment booking system (SWP391 → SEP490, FPT University), planned and run on CT Work with the process written up on this site.',
      'Hệ thống đặt phòng lab và mượn thiết bị (SWP391 → SEP490, Đại học FPT), lên kế hoạch và quản lý trên CT Work theo đúng quy trình viết trên trang này.',
    ),
    platforms: L('Java 21 · Spring Boot · React · PostgreSQL', 'Java 21 · Spring Boot · React · PostgreSQL'),
    status: L('In development', 'Đang phát triển'),
    state: 'testing',
    links: [
      { href: '/projects/labflow-ai', label: L('Project file', 'Hồ sơ dự án') },
      { href: '/about/studio/case/labflow-ai', label: L('Case study', 'Case study') },
    ],
  },
];
