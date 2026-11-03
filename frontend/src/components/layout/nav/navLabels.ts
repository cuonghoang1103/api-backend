/**
 * The SMALL half of the navigation copy — what the always-mounted bar needs.
 * The full tree (icons + descriptions) is `navTree.ts` and only loads in lazy
 * chunks. Keep this file free of icon imports.
 */
export type MenuId = 'learn' | 'practice' | 'tools' | 'community' | 'about';
export type Locale = 'en' | 'vi';

export const MENU_ORDER: MenuId[] = ['about', 'learn', 'practice', 'tools', 'community'];

export const MENU_LABEL: Record<MenuId, { en: string; vi: string }> = {
  learn: { en: 'Learn', vi: 'Học' },
  practice: { en: 'Practice', vi: 'Luyện tập' },
  tools: { en: 'AI & Tools', vi: 'AI & Công cụ' },
  community: { en: 'Community', vi: 'Cộng đồng' },
  about: { en: 'About', vi: 'Giới thiệu' },
};

/**
 * One hue per menu. The icon tiles of a menu share it, so colour tells you
 * which part of the site an item belongs to — in the panel, the mobile sheet
 * and the ⌘K results alike.
 */
export const MENU_HUE: Record<MenuId, string> = {
  learn: '#8b5cf6',
  practice: '#f59e0b',
  tools: '#06b6d4',
  community: '#f43f5e',
  about: '#10b981',
};

const UI = {
  en: {
    home: 'CuongThai home',
    search: 'Search',
    searchHint: 'Search pages',
    login: 'Log in',
    signup: 'Sign up',
    openMenu: 'Open menu',
    closeMenu: 'Close menu',
    mainNav: 'Main',
    back: 'Go back',
    notifications: 'Notifications',
    messages: 'Messenger',
    cart: 'Cart',
    account: 'Account',
    theme: { dark: 'Switch to dark theme', light: 'Switch to light theme' },
    themeShort: { dark: 'Dark', light: 'Light' },
    language: 'Tiếng Việt',
    languageShort: 'VI',
    languageAria: 'Chuyển sang tiếng Việt',
    pro: 'Pro member',
    getPro: 'Upgrade to Pro',
    changePassword: 'Change password',
    logout: 'Log out',
    loggedOut: 'Logged out',
    needHelp: 'Questions about a course or working together?',
    contactPage: 'Contact page',
    paletteTitle: 'Go to…',
    palettePlaceholder: 'Search pages, tools and courses…',
    paletteEmpty: 'No page matches that.',
    paletteSearchPeople: 'Search people for',
    paletteAccount: 'Your account',
    paletteHint: 'to open · Esc to close',
    menuTitle: 'Menu',
    signedOutHint: 'Sign in to save your progress.',
  },
  vi: {
    home: 'Trang chủ CuongThai',
    search: 'Tìm kiếm',
    searchHint: 'Tìm trang',
    login: 'Đăng nhập',
    signup: 'Đăng ký',
    openMenu: 'Mở menu',
    closeMenu: 'Đóng menu',
    mainNav: 'Điều hướng chính',
    back: 'Quay lại',
    notifications: 'Thông báo',
    messages: 'Tin nhắn',
    cart: 'Giỏ hàng',
    account: 'Tài khoản',
    theme: { dark: 'Chuyển sang giao diện tối', light: 'Chuyển sang giao diện sáng' },
    themeShort: { dark: 'Tối', light: 'Sáng' },
    language: 'English',
    languageShort: 'EN',
    languageAria: 'Switch to English',
    pro: 'Thành viên Pro',
    getPro: 'Nâng cấp Pro',
    changePassword: 'Đổi mật khẩu',
    logout: 'Đăng xuất',
    loggedOut: 'Đã đăng xuất',
    needHelp: 'Cần tư vấn khoá học hoặc muốn hợp tác?',
    contactPage: 'Trang liên hệ',
    paletteTitle: 'Đi tới…',
    palettePlaceholder: 'Tìm trang, công cụ, khoá học…',
    paletteEmpty: 'Không có trang nào khớp.',
    paletteSearchPeople: 'Tìm người tên',
    paletteAccount: 'Tài khoản của bạn',
    paletteHint: 'để mở · Esc để đóng',
    menuTitle: 'Menu',
    signedOutHint: 'Đăng nhập để lưu tiến độ học.',
  },
} as const;

export type UiCopy = (typeof UI)['en'];
export function uiCopy(locale: string): UiCopy {
  return (locale === 'vi' ? UI.vi : UI.en) as UiCopy;
}

/** Public contact points — same set as the old top bar and the About page. */
export const CONTACT = {
  phone: '+84399360938',
  zalo: 'https://zalo.me/0399360938',
  email: 'cuongthaihnhe176322@gmail.com',
  facebook: 'https://www.facebook.com/CuongHoangswit/',
} as const;

/** Global ⌘K palette: these pages own ⌘K themselves, so the global one steps aside. */
export const PAGES_WITH_OWN_CMD_K = ['/notes', '/work', '/admin', '/ai-templates', '/hub', '/dashboard/cyber-tasks'];
export function pageOwnsCmdK(pathname: string | null): boolean {
  if (!pathname) return false;
  if (/^\/courses\/[^/]+\/learn/.test(pathname)) return true;
  return PAGES_WITH_OWN_CMD_K.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}

/** Event other components can fire to open the palette (e.g. a search button). */
export const OPEN_PALETTE_EVENT = 'ct:open-palette';

/**
 * Which top-level menu "owns" a path — drives the underline on the bar without
 * loading the full tree. Keep in step with `navTree.ts` (`navTree.test.ts`
 * checks every tree href resolves to its own menu here).
 */
export const MENU_PREFIXES: Record<MenuId, string[]> = {
  learn: ['/academy', '/courses', '/roadmap', '/hoc-tap', '/exam', '/books', '/my-courses', '/certificates'],
  practice: ['/code-lab', '/algorithms', '/simulation', '/maker-lab', '/interview', '/cv', '/language'],
  tools: ['/chat', '/voice-mini', '/ai-templates', '/ai-code', '/cli', '/llm-key', '/kiem-tra-key', '/work', '/notes', '/finance', '/music', '/games', '/toc-do-mang', '/pro', '/shop', '/download'],
  community: ['/feed', '/tech-trends', '/forum', '/friends', '/messages', '/projects', '/repos', '/exp-hub', '/hub'],
  about: ['/about'],
};
export function menuForPath(pathname: string | null): MenuId | null {
  if (!pathname) return null;
  for (const id of MENU_ORDER) {
    if (MENU_PREFIXES[id].some((p) => pathname === p || pathname.startsWith(`${p}/`))) return id;
  }
  return null;
}
