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
import { MauAIPage } from './features/aitemplates/MauAIPage';
import { ChatPage } from './features/chat/ChatPage';
import { DashboardPage } from './features/dashboard/DashboardPage';
import { FeedPage } from './features/feed/FeedPage';
import { FriendsPage } from './features/friends/FriendsPage';
import { MessagesPage } from './features/messages/MessagesPage';
import { CvPage } from './features/cv/CvPage';
import { MusicPage } from './features/music/MusicPage';
import { NotesPage } from './features/notes/NotesPage';
import { ProPage } from './features/pro/ProPage';
import { TechTrendsPage } from './features/tech-trends/TechTrendsPage';
import { HocVienPage } from './features/academy/HocVienPage';
import { GiongNoiPage } from './features/voice/GiongNoiPage';

export const NATIVE_PAGES: Readonly<Record<string, ComponentType>> = {
  '/dashboard': DashboardPage,
  '/feed': FeedPage,
  '/messages': MessagesPage,
  '/friends': FriendsPage,
  '/chat': ChatPage,
  '/cv': CvPage,
  '/music': MusicPage,
  '/notes': NotesPage,
  '/pro': ProPage,
  '/tech-trends': TechTrendsPage,
  '/ai-templates': MauAIPage,
  '/voice': GiongNoiPage,
  '/academy': HocVienPage,
};

export function nativePageFor(path: string): ComponentType | undefined {
  return NATIVE_PAGES[path];
}
