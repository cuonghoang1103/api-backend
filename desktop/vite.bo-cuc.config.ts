/**
 * Bản dựng riêng cho phép ĐO BỐ CỤC (`npm run do:bo-cuc`).
 *
 * Không đụng tới bản dựng thật: nó nạp đúng `styles.css` và đúng component của
 * từng trang, nhưng thay các module cần phiên đăng nhập / cầu nối Electron
 * bằng bản giả, để trang vẽ ra được mà không cần máy chủ.
 */
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { noiDungBai } from './vite.noi-dung-bai';
import path from 'node:path';
import { aliasDesktop } from './vite.alias';

const duong = (p: string) => path.resolve(__dirname, p);

/**
 * Thay module ở tầng `load`, KHÔNG sửa mã trang.
 *
 * Sửa trang để chiều bộ đo thì bộ đo hết ý nghĩa — nó sẽ đo một phiên bản
 * không ai chạy. Ở đây mã trang giữ nguyên từng chữ.
 */
/*
 * ⚠️ Nội dung bản giả đến từ hook `load` NÀY, nhưng vite lại cache theo mtime
 * của FILE GỐC. Sửa file cấu hình mà không đụng `app-state.tsx` thì vite không
 * thấy gì đổi và lặng lẽ dựng lại bằng bản giả CŨ — mất nửa giờ đi tìm một lỗi
 * đã sửa xong từ lâu. Vì thế `npm run do:bo-cuc` xoá `node_modules/.vite`
 * trước mỗi lần dựng.
 */
function gia() {
  return {
    name: 'bo-cuc-gia',
    load(id: string) {
      if (id === duong('src/renderer/app-state.tsx')) {
        return `
          import { createElement } from 'react';
          /* Phải khai ĐỦ bề mặt useAppState thật. Thiếu layThamSo, trang
             Trò chuyện nổ ngay lúc gắn và bộ đo báo "trang trống" — một lỗi
             của BỘ ĐO đội lốt lỗi của trang.
             (Không dùng dấu huyền ở đây: cả khối này nằm TRONG một template
             literal, một dấu huyền là cắt đứt chuỗi và hỏng cả file cấu hình.) */
          import { createContext, useContext, useState, useMemo } from 'react';
          const S = { online: true, settings: {}, setSetting: () => {}, resolvedTheme: 'dark',
                      theme: 'dark', toggleSidebar: () => {}, zoom: 1, datZoom: () => {},
                      layThamSo: () => null, datThamSo: () => {}, lanDieuHuong: 0 };
          /* ⚠️ PHẢI CÓ route + navigate THẬT, không phải hằng.
             Bản đầu để S tĩnh không có route, và cây Ngoại ngữ nổ ngay ở
             khopTuyenWeb(undefined) — bộ đo báo ba trang ĐỎ trong khi mã trang
             hoàn toàn đúng. Lại là lỗi của BỘ ĐO đội lốt lỗi của trang, lần
             thứ hai trong cùng tệp này.
             Và navigate phải ĐỔI ĐƯỢC route: bước CHUAN_BI của /roadmap bấm
             vào một lộ trình để đi tới trang con. Với navigate rỗng thì cú bấm
             không làm gì, và phép kiểm trang con XANH mà chẳng kiểm gì. */
          const Ctx = createContext(null);
          export function AppStateProvider({ children, tuyenBanDau }) {
            const [route, datRoute] = useState(tuyenBanDau ?? '/dashboard');
            const v = useMemo(
              () => ({ ...S, route, navigate: (p) => datRoute(p) }),
              [route],
            );
            return createElement(Ctx.Provider, { value: v }, children);
          }
          export function useAppState() {
            const c = useContext(Ctx);
            if (!c) throw new Error('useAppState phai nam trong AppStateProvider');
            return c;
          }`;
      }
      if (id === duong('src/renderer/auth/session.tsx')) {
        /* `api` và object phiên phải là THAM CHIẾU CỐ ĐỊNH. Trả object mới mỗi
           lần gọi thì mọi `useCallback([api])` đổi theo từng render ⇒ effect
           chạy lại ⇒ setState ⇒ lặp vô hạn, luồng chính đứng hình. Phiên thật
           đã `useMemo`, nên bản giả phải giống. */
        return `
          const API = { request: (d, o) => window.__giaApi(d, o),
                        baseUrlForForms: () => '', authHeaders: () => ({}),
                        getToken: () => 'gia', setToken: () => {} };
          const NGUOI = { id: 1, username: 'thu', displayName: 'Người thử', isPro: true, role: 'USER' };
          const PHIEN = { userId: 1, api: API, user: NGUOI, phase: 'ready',
                          dangNhap: async () => {}, dangXuat: async () => {} };
          export function useSession() { return PHIEN; }
          export function SessionProvider({ children }) { return children; }`;
      }
      if (id === duong('src/renderer/offline/cache.ts')) {
        return `
          export class OfflineUnavailableError extends Error {}
          export async function readCache() { return null; }
          export async function writeCache() {}
          export async function swr({ fetcher }) { return { value: await fetcher(), isStale: false }; }`;
      }
      return null;
    },
  };
}

export default defineConfig({
  root: path.resolve(__dirname, 'scripts'),
  base: './',
  plugins: [react(), noiDungBai(__dirname), gia()],
  resolve: {
    // Cùng MỘT bảng với bản dựng thật — xem `vite.alias.ts`.
    alias: aliasDesktop(__dirname),
  },
  build: {
    outDir: duong('dist/bo-cuc'),
    emptyOutDir: true,
    target: 'chrome128',
    /* Bản đồ nguồn: không có nó thì mọi lỗi chỉ ra `trang-thu-xxx.js:873`,
       và bộ đo trở nên vô dụng đúng lúc nó tìm được lỗi. */
    sourcemap: true,
    minify: false,
    rollupOptions: { input: duong('scripts/bo-cuc/trang-thu.html') },
  },
});
