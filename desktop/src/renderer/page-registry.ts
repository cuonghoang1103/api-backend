/**
 * Sổ đăng ký màn hình native.
 *
 * MỘT nguồn sự thật cho câu hỏi "route này đã có màn hình native chưa".
 *
 * Trước đây thông tin này nằm ở hai nơi: cờ `ported` trong `routes.ts` (sidebar
 * đọc để quyết định hiện gì) và một chuỗi `if` trong `App.tsx` (router đọc để
 * dựng màn hình). Hai nơi thì sẽ có ngày lệch nhau, và lệch kiểu nào cũng tệ:
 *   • `ported: true` mà thiếu component → sidebar dẫn vào màn hình "chưa có",
 *     mâu thuẫn với chính nó.
 *   • có component mà `ported: false` → màn hình đã viết xong nhưng không ai
 *     vào được.
 *
 * Giờ `ported` được TÍNH RA từ sổ này (xem `isPorted` trong routes.ts), nên
 * lệch là chuyện không xảy ra được nữa.
 */
import type { ComponentType } from 'react';
import { ChatPage } from './features/chat/ChatPage';
import { CvPage } from './features/cv/CvPage';
import { MusicPage } from './features/music/MusicPage';
import { NotesPage } from './features/notes/NotesPage';
import { ProPage } from './features/pro/ProPage';
import { TechTrendsPage } from './features/tech-trends/TechTrendsPage';

export const NATIVE_PAGES: Readonly<Record<string, ComponentType>> = {
  '/chat': ChatPage,
  '/cv': CvPage,
  '/music': MusicPage,
  '/notes': NotesPage,
  '/pro': ProPage,
  '/tech-trends': TechTrendsPage,
};

export function nativePageFor(path: string): ComponentType | undefined {
  return NATIVE_PAGES[path];
}
